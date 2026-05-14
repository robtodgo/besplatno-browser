import { create } from 'zustand';

interface MobileTab {
  id: string;
  url: string;
  title: string;
}

interface MobileTabState {
  tabs: MobileTab[];
  activeTabId: string;
  
  addTab: (url?: string) => void;
  closeTab: (id: string) => void;
  setActiveTabId: (id: string) => void;
  updateActiveTab: (updates: Partial<MobileTab>) => void;
}

export const useMobileTabStore = create<MobileTabState>((set) => ({
  tabs: [{ id: '1', url: 'https://search.yahoo.com', title: 'Yahoo!' }],
  activeTabId: '1',

  addTab: (url = 'https://search.yahoo.com') => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      tabs: [...state.tabs, { id, url, title: 'Новая вкладка' }],
      activeTabId: id,
    }));
  },

  closeTab: (id) => {
    set((state) => {
      const newTabs = state.tabs.filter((t) => t.id !== id);
      if (newTabs.length === 0) {
        return {
          tabs: [{ id: '1', url: 'https://search.yahoo.com', title: 'Yahoo!' }],
          activeTabId: '1',
        };
      }
      const newActiveId = state.activeTabId === id ? newTabs[newTabs.length - 1].id : state.activeTabId;
      return { tabs: newTabs, activeTabId: newActiveId };
    });
  },

  setActiveTabId: (id) => set({ activeTabId: id }),

  updateActiveTab: (updates) => {
    set((state) => ({
      tabs: state.tabs.map((t) => (t.id === state.activeTabId ? { ...t, ...updates } : t)),
    }));
  },
}));
