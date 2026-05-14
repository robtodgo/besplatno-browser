// Вспомогательный модуль для управления заголовком окна
// Основная логика кастомного заголовка реализована в renderer (TitleBar.tsx)

import { BrowserWindow } from 'electron';

export function setupTitleBarListeners(win: BrowserWindow): void {
  // Отправляем состояние максимизации в renderer при изменении
  win.on('maximize', () => {
    win.webContents.send('window-state-changed', { isMaximized: true });
  });

  win.on('unmaximize', () => {
    win.webContents.send('window-state-changed', { isMaximized: false });
  });

  win.on('enter-full-screen', () => {
    win.webContents.send('window-state-changed', { isFullScreen: true });
  });

  win.on('leave-full-screen', () => {
    win.webContents.send('window-state-changed', { isFullScreen: false });
  });
}
