import { Session } from 'electron';
import path from 'path';

// Хост для управления расширениями Chrome
export class ExtensionHost {
  private session: Session;

  constructor(session: Session) {
    this.session = session;
  }

  async init(): Promise<void> {
    try {
      // Загрузка встроенного блокировщика рекламы
      await this.loadBuiltinAdblock();
      console.log('Расширения инициализированы');
    } catch (error) {
      console.error('Ошибка инициализации расширений:', error);
    }
  }

  // Загрузка встроенного adblock-расширения
  private async loadBuiltinAdblock(): Promise<void> {
    const adblockPath = path.join(__dirname, '../../../builtin-extensions/adblock');
    try {
      await this.session.loadExtension(adblockPath, { allowFileAccess: true });
      console.log('Встроенный блокировщик рекламы загружен');
    } catch (error) {
      console.warn('Не удалось загрузить adblock:', error);
    }
  }

  // Загрузка пользовательского расширения из папки
  async loadExtension(extensionPath: string): Promise<string | null> {
    try {
      const ext = await this.session.loadExtension(extensionPath);
      console.log(`Расширение загружено: ${ext.name}`);
      return ext.id;
    } catch (error) {
      console.error(`Ошибка загрузки расширения из ${extensionPath}:`, error);
      return null;
    }
  }

  // Получение списка установленных расширений
  getInstalledExtensions(): Electron.Extension[] {
    return this.session.getAllExtensions();
  }

  // Удаление расширения
  async removeExtension(extensionId: string): Promise<void> {
    try {
      await this.session.removeExtension(extensionId);
      console.log(`Расширение ${extensionId} удалено`);
    } catch (error) {
      console.error(`Ошибка удаления расширения ${extensionId}:`, error);
    }
  }
}
