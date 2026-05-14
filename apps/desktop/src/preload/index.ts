import { contextBridge, ipcRenderer } from 'electron';

// Безопасный мост между renderer и main процессами
// Экспортирует только разрешённые API через contextBridge

contextBridge.exposeInMainWorld('electronAPI', {
  // === Управление окном ===
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  isMaximized: () => ipcRenderer.invoke('window-is-maximized'),

  // === Управление вкладками ===
  createTab: (payload?: { url?: string; isPrivate?: boolean }) =>
    ipcRenderer.invoke('tab-create', payload),
  switchTab: (tabId: string) => ipcRenderer.send('tab-switch', { tabId }),
  closeTab: (tabId: string) => ipcRenderer.send('tab-close', { tabId }),
  getAllTabs: () => ipcRenderer.invoke('tabs-get-all'),
  getActiveTabId: () => ipcRenderer.invoke('tab-get-active'),

  // === Навигация ===
  navigate: (url: string, tabId?: string) =>
    ipcRenderer.send('navigation-navigate', { url, tabId }),
  goBack: (tabId?: string) => ipcRenderer.send('navigation-back', { tabId }),
  goForward: (tabId?: string) => ipcRenderer.send('navigation-forward', { tabId }),
  reload: (tabId?: string) => ipcRenderer.send('navigation-reload', { tabId }),
  stop: (tabId?: string) => ipcRenderer.send('navigation-stop', { tabId }),

  // === Подписка на события из main ===
  onTabCreated: (callback: (tab: unknown) => void) =>
    ipcRenderer.on('tab-created', (_, tab) => callback(tab)),
  onTabClosed: (callback: (data: { tabId: string }) => void) =>
    ipcRenderer.on('tab-closed', (_, data) => callback(data)),
  onTabUpdated: (callback: (tab: unknown) => void) =>
    ipcRenderer.on('tab-updated', (_, tab) => callback(tab)),
  onTabSwitched: (callback: (data: { tabId: string }) => void) =>
    ipcRenderer.on('tab-switched', (_, data) => callback(data)),
  onWindowStateChanged: (callback: (state: unknown) => void) =>
    ipcRenderer.on('window-state-changed', (_, state) => callback(state)),

  // Отписка от событий
  removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
});
