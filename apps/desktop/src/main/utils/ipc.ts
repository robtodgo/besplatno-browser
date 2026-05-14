import { IpcMain } from 'electron';
import { WindowManager } from '../window/WindowManager';
import { TabManager } from '../tabs/TabManager';

// Регистрация всех IPC-обработчиков
export function registerIpcHandlers(
  ipcMain: IpcMain,
  windowManager: WindowManager,
  tabManager: TabManager
): void {
  // === Управление окном ===
  ipcMain.on('window-minimize', () => {
    windowManager.minimize();
  });

  ipcMain.on('window-maximize', () => {
    windowManager.maximize();
  });

  ipcMain.on('window-close', () => {
    windowManager.close();
  });

  ipcMain.handle('window-is-maximized', () => {
    return windowManager.isMaximized();
  });

  // === Управление вкладками ===
  ipcMain.handle('tab-create', (_, payload: { url?: string; isPrivate?: boolean }) => {
    return tabManager.createTab(payload?.url, payload?.isPrivate);
  });

  ipcMain.on('tab-switch', (_, payload: { tabId: string }) => {
    tabManager.switchTab(payload.tabId);
  });

  ipcMain.on('tab-close', (_, payload: { tabId: string }) => {
    tabManager.closeTab(payload.tabId);
  });

  ipcMain.handle('tabs-get-all', () => {
    return tabManager.getAllTabs();
  });

  ipcMain.handle('tab-get-active', () => {
    return tabManager.getActiveTabId();
  });

  // === Навигация ===
  ipcMain.on('navigation-navigate', (_, payload: { url: string; tabId?: string }) => {
    tabManager.navigate(payload.url, payload.tabId);
  });

  ipcMain.on('navigation-back', (_, payload?: { tabId?: string }) => {
    tabManager.goBack(payload?.tabId);
  });

  ipcMain.on('navigation-forward', (_, payload?: { tabId?: string }) => {
    tabManager.goForward(payload?.tabId);
  });

  ipcMain.on('navigation-reload', (_, payload?: { tabId?: string }) => {
    tabManager.reload(payload?.tabId);
  });

  ipcMain.on('navigation-stop', (_, payload?: { tabId?: string }) => {
    tabManager.stop(payload?.tabId);
  });
}
