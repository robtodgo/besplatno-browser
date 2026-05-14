import { create } from 'zustand';
import { Tab } from '@besplatno/shared';

interface TabState {
  tabs: Tab[];
  activeTabId: string | null;
  
  // Действия
  initTabs: () => Promise<void>;
  setActiveTabId: (id: string) => void;
  addTab: (url?: string, isPrivate?: boolean) => void;
  closeTab: (id: string) => void;
  
  // Обработчики событий из main
  handleTabCreated: (tab: Tab) => void;
  handleTabClosed: (id: string) => void;
  handleTabUpdated: (tab: Tab) => void;
}

export const useTabStore = create<TabState>((set, get) => ({
  tabs: [],
  activeTabId: null,

  initTabs: async () => {
    const tabs = await window.electronAPI?.getAllTabs();
    const activeTabId = await window.electronAPI?.getActiveTabId();
    
    if (tabs && tabs.length > 0) {
      set({ tabs, activeTabId });
    } else {
      // Если вкладок нет, создаём новую
      window.electronAPI?.createTab();
    }
  },

  setActiveTabId: (id: string) => {
    set({ activeTabId: id });
    window.electronAPI?.switchTab(id);
  },

  addTab: (url, isPrivate) => {
    window.electronAPI?.createTab({ url, isPrivate });
  },

  closeTab: (id: string) => {
    window.electronAPI?.closeTab(id);
  },

  handleTabCreated: (tab) => {
    set((state) => ({
      tabs: [...state.tabs, tab],
      activeTabId: tab.id
    }));
  },

  handleTabClosed: (id) => {
    set((state) => {
      const newTabs = state.tabs.filter(t => t.id !== id);
      return { tabs: newTabs };
    });
  },

  handleTabUpdated: (updatedTab) => {
    set((state) => ({
      tabs: state.tabs.map(t => t.id === updatedTab.id ? updatedTab : t)
    }));
  }
}));
