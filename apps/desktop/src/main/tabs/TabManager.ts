import { WebContentsView, BrowserWindow } from 'electron';
import { Tab } from '@besplatno/shared';
import { TAB_SETTINGS } from '@besplatno/shared';
import { normalizeUrl } from '@besplatno/shared';
import { v4 as uuidv4 } from 'uuid';

interface ManagedTab {
  tab: Tab;
  view: WebContentsView | null;
  hibernateTimer?: NodeJS.Timeout;
}

// Менеджер вкладок — управляет WebContentsView для каждой вкладки
export class TabManager {
  private tabs: Map<string, ManagedTab> = new Map();
  private activeTabId: string | null = null;
  private mainWindow: BrowserWindow | null = null;

  setMainWindow(win: BrowserWindow): void {
    this.mainWindow = win;
  }

  // Создание новой вкладки
  createTab(url?: string, isPrivate = false): Tab {
    const id = uuidv4();
    const normalizedUrl = url ? normalizeUrl(url) : 'about:blank';

    const tab: Tab = {
      id,
      url: normalizedUrl,
      title: 'Новая вкладка',
      isLoading: false,
      isPinned: false,
      isPrivate,
      createdAt: Date.now(),
      lastAccessedAt: Date.now(),
    };

    const view = this.createWebContentsView(tab);

    this.tabs.set(id, { tab, view });
    this.switchTab(id);
    this.notifyRenderer('tab-created', tab);

    return tab;
  }

  // Создание WebContentsView для вкладки
  private createWebContentsView(tab: Tab): WebContentsView {
    const view = new WebContentsView({
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
        // Приватный режим — отдельная сессия
        partition: tab.isPrivate ? `private-${tab.id}` : 'persist:default',
      },
    });

    // Загрузка URL
    if (tab.url && tab.url !== 'about:blank') {
      view.webContents.loadURL(tab.url).catch(console.error);
    }

    // Обработчики событий вкладки
    view.webContents.on('page-title-updated', (_, title) => {
      this.updateTab(tab.id, { title });
    });

    view.webContents.on('did-start-loading', () => {
      this.updateTab(tab.id, { isLoading: true });
    });

    view.webContents.on('did-stop-loading', () => {
      this.updateTab(tab.id, { isLoading: false, url: view.webContents.getURL() });
    });

    view.webContents.on('page-favicon-updated', (_, favicons) => {
      if (favicons.length > 0) {
        this.updateTab(tab.id, { favicon: favicons[0] });
      }
    });

    return view;
  }

  // Переключение на вкладку
  switchTab(tabId: string): void {
    const managed = this.tabs.get(tabId);
    if (!managed || !this.mainWindow) return;

    // Скрываем текущую активную вкладку
    if (this.activeTabId && this.activeTabId !== tabId) {
      const currentManaged = this.tabs.get(this.activeTabId);
      if (currentManaged?.view) {
        this.mainWindow.contentView.removeChildView(currentManaged.view);
        // Запускаем таймер гибернации
        this.scheduleHibernation(this.activeTabId);
      }
    }

    // Пробуждаем вкладку если она была в гибернации
    if (!managed.view) {
      managed.view = this.createWebContentsView(managed.tab);
    }

    // Отменяем таймер гибернации
    if (managed.hibernateTimer) {
      clearTimeout(managed.hibernateTimer);
      managed.hibernateTimer = undefined;
    }

    // Показываем новую вкладку
    this.mainWindow.contentView.addChildView(managed.view);
    const bounds = this.mainWindow.getContentBounds();
    managed.view.setBounds({
      x: 0,
      y: 80, // Высота тулбара
      width: bounds.width,
      height: bounds.height - 80,
    });

    this.activeTabId = tabId;
    managed.tab.lastAccessedAt = Date.now();

    this.notifyRenderer('tab-switched', { tabId });
  }

  // Закрытие вкладки
  closeTab(tabId: string): void {
    const managed = this.tabs.get(tabId);
    if (!managed) return;

    if (managed.hibernateTimer) {
      clearTimeout(managed.hibernateTimer);
    }

    if (managed.view && this.mainWindow) {
      this.mainWindow.contentView.removeChildView(managed.view);
      managed.view.webContents.close();
    }

    this.tabs.delete(tabId);

    // Если закрыли активную вкладку — переключаемся на другую
    if (this.activeTabId === tabId) {
      const remaining = Array.from(this.tabs.keys());
      if (remaining.length > 0) {
        this.switchTab(remaining[remaining.length - 1]);
      } else {
        this.activeTabId = null;
        this.createTab();
      }
    }

    this.notifyRenderer('tab-closed', { tabId });
  }

  // Обновление данных вкладки
  updateTab(tabId: string, updates: Partial<Tab>): void {
    const managed = this.tabs.get(tabId);
    if (!managed) return;

    managed.tab = { ...managed.tab, ...updates };
    this.notifyRenderer('tab-updated', managed.tab);
  }

  // Навигация в активной вкладке
  navigate(url: string, tabId?: string): void {
    const id = tabId ?? this.activeTabId;
    if (!id) return;

    const managed = this.tabs.get(id);
    if (!managed?.view) return;

    const normalizedUrl = normalizeUrl(url);
    managed.view.webContents.loadURL(normalizedUrl).catch(console.error);
    this.updateTab(id, { url: normalizedUrl });
  }

  goBack(tabId?: string): void {
    const id = tabId ?? this.activeTabId;
    const managed = id ? this.tabs.get(id) : null;
    if (managed?.view?.webContents.canGoBack()) {
      managed.view.webContents.goBack();
    }
  }

  goForward(tabId?: string): void {
    const id = tabId ?? this.activeTabId;
    const managed = id ? this.tabs.get(id) : null;
    if (managed?.view?.webContents.canGoForward()) {
      managed.view.webContents.goForward();
    }
  }

  reload(tabId?: string): void {
    const id = tabId ?? this.activeTabId;
    const managed = id ? this.tabs.get(id) : null;
    managed?.view?.webContents.reload();
  }

  stop(tabId?: string): void {
    const id = tabId ?? this.activeTabId;
    const managed = id ? this.tabs.get(id) : null;
    managed?.view?.webContents.stop();
  }

  // Гибернация вкладки через 5 минут бездействия
  private scheduleHibernation(tabId: string): void {
    const managed = this.tabs.get(tabId);
    if (!managed) return;

    managed.hibernateTimer = setTimeout(() => {
      if (tabId !== this.activeTabId && managed.view) {
        managed.view.webContents.close();
        managed.view = null;
        console.log(`Вкладка ${tabId} переведена в гибернацию`);
      }
    }, TAB_SETTINGS.hibernateAfterMs);
  }

  // Отправка уведомлений в renderer
  private notifyRenderer(event: string, data: unknown): void {
    this.mainWindow?.webContents.send(event, data);
  }

  getAllTabs(): Tab[] {
    return Array.from(this.tabs.values()).map((m) => m.tab);
  }

  getActiveTabId(): string | null {
    return this.activeTabId;
  }
}
