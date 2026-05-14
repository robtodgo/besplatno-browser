import { app, BrowserWindow, ipcMain, session } from 'electron';
import path from 'path';
import { WindowManager } from './window/WindowManager';
import { TabManager } from './tabs/TabManager';
import { ExtensionHost } from './extensions/ExtensionHost';
import { registerIpcHandlers } from './utils/ipc';

// Установка идентификатора приложения (важно для Windows)
app.setAppUserModelId('com.besplatno.browser');

// Отключение аппаратного ускорения при необходимости
// app.disableHardwareAcceleration();

let windowManager: WindowManager;
let tabManager: TabManager;
let extensionHost: ExtensionHost;

app.whenReady().then(async () => {
  // Инициализация менеджеров
  windowManager = new WindowManager();
  tabManager = new TabManager();
  extensionHost = new ExtensionHost(session.defaultSession);

  // Создание главного окна
  const mainWindow = windowManager.createMainWindow();

  // Инициализация расширений
  await extensionHost.init();

  // Регистрация IPC-обработчиков
  registerIpcHandlers(ipcMain, windowManager, tabManager);

  // Открытие DevTools в режиме разработки
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      windowManager.createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Обработка необработанных ошибок
process.on('uncaughtException', (error) => {
  console.error('Необработанная ошибка:', error);
});
