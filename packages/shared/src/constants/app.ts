// Константы приложения Besplatno Browser

export const APP_NAME = 'Besplatno Browser';
export const APP_ID = 'com.besplatno.browser';
export const APP_VERSION = '1.0.0';

// Цветовая схема: оранжевая панель, зелёные кнопки
export const COLORS = {
  toolbarBg: '#FF8C00',
  toolbarBgGradient: 'linear-gradient(135deg, #FF8C00 0%, #FFA500 100%)',
  buttonGreen: '#22C55E',
  buttonGreenGradient: 'linear-gradient(135deg, #16A34A 0%, #22C55E 100%)',
  buttonGreenHover: '#16A34A',
  tabActive: '#FFA500',
  tabInactive: '#E07B00',
  textLight: '#FFFFFF',
  textDark: '#1A1A1A',
} as const;

// Настройки вкладок
export const TAB_SETTINGS = {
  maxTabs: 50,
  hibernateAfterMs: 5 * 60 * 1000, // 5 минут
  maxTitleLength: 40,
} as const;
