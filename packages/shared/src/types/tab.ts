// Общие типы для вкладок браузера

export interface Tab {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  isLoading: boolean;
  isPinned: boolean;
  isPrivate: boolean;
  createdAt: number;
  lastAccessedAt: number;
}

export interface TabGroup {
  id: string;
  name: string;
  color: string;
  tabIds: string[];
}

export type TabPosition = 'horizontal' | 'vertical';
