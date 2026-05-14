import { BrowserWindow, nativeTheme } from 'electron';
import path from 'path';

// Менеджер окон браузера
export class WindowManager {
  private mainWindow: BrowserWindow | null = null;

  createMainWindow(): BrowserWindow {
    this.mainWindow = new BrowserWindow({
      width: 1280,
      height: 800,
      minWidth: 800,
      minHeight: 600,
      // Убираем стандартный заголовок — используем кастомный
      frame: false,
      // Прозрачный фон для эффекта Mica на Windows 11
      transparent: process.platform === 'win32',
      backgroundColor: process.platform === 'win32' ? undefined : '#1a1a1a',
      icon: path.join(__dirname, '../../assets/icon.png'),
      webPreferences: {
        preload: path.join(__dirname, '../../preload/index.js'),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
        webSecurity: true,
      },
      titleBarStyle: 'hidden',
      show: false,
    });

    // Применение эффекта Mica на Windows 11
    if (process.platform === 'win32') {
      this.mainWindow.setBackgroundMaterial?.('mica');
    }

    // Загрузка renderer
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:5173');
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../../renderer/index.html'));
    }

    // Показываем окно после загрузки, чтобы избежать мерцания
    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });

    return this.mainWindow;
  }

  getMainWindow(): BrowserWindow | null {
    return this.mainWindow;
  }

  minimize(): void {
    this.mainWindow?.minimize();
  }

  maximize(): void {
    if (this.mainWindow?.isMaximized()) {
      this.mainWindow.unmaximize();
    } else {
      this.mainWindow?.maximize();
    }
  }

  close(): void {
    this.mainWindow?.close();
  }

  isMaximized(): boolean {
    return this.mainWindow?.isMaximized() ?? false;
  }
}
