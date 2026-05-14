import React, { useEffect } from 'react';
import { TitleBar } from './components/TitleBar';
import { TabBar } from './components/TabBar';
import { AddressBar } from './components/AddressBar';
import { Sidebar } from './components/Sidebar';
import { useTabStore } from './stores/tabStore';

// Главный компонент приложения
const App: React.FC = () => {
  const { initTabs, addTab } = useTabStore();

  useEffect(() => {
    // Инициализация: загружаем существующие вкладки или создаём первую
    initTabs();

    // Подписка на события из main-процесса
    window.electronAPI?.onTabCreated((tab) => {
      useTabStore.getState().handleTabCreated(tab as any);
    });

    window.electronAPI?.onTabClosed(({ tabId }) => {
      useTabStore.getState().handleTabClosed(tabId);
    });

    window.electronAPI?.onTabUpdated((tab) => {
      useTabStore.getState().handleTabUpdated(tab as any);
    });

    window.electronAPI?.onTabSwitched(({ tabId }) => {
      useTabStore.getState().setActiveTabId(tabId);
    });

    return () => {
      window.electronAPI?.removeAllListeners('tab-created');
      window.electronAPI?.removeAllListeners('tab-closed');
      window.electronAPI?.removeAllListeners('tab-updated');
      window.electronAPI?.removeAllListeners('tab-switched');
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-transparent overflow-hidden select-none">
      {/* Кастомный заголовок окна */}
      <TitleBar />

      {/* Панель вкладок */}
      <TabBar />

      {/* Адресная строка */}
      <AddressBar />

      {/* Основной контент (WebContentsView управляется из main) */}
      <div className="flex-1 relative">
        <Sidebar />
      </div>
    </div>
  );
};

export default App;
