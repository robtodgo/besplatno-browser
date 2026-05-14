import React from 'react';
import { useTabStore } from '../stores/tabStore';
import { motion, Reorder } from 'framer-motion';
import { Tab } from '@besplatno/shared';

export const TabBar: React.FC = () => {
  const { tabs, activeTabId, setActiveTabId, closeTab, addTab } = useTabStore();

  const handleReorder = (newTabs: Tab[]) => {
    // В реальном приложении здесь было бы обновление порядка в main-процессе
    useTabStore.setState({ tabs: newTabs });
  };

  return (
    <div className="flex items-center bg-[#E07B00] h-10 px-2 gap-1 overflow-x-auto no-scrollbar">
      <Reorder.Group
        axis="x"
        values={tabs}
        onReorder={handleReorder}
        className="flex items-center gap-1"
      >
        {tabs.map((tab) => (
          <Reorder.Item
            key={tab.id}
            value={tab}
            className={`
              relative flex items-center min-w-[120px] max-w-[200px] h-8 px-3 rounded-t-lg cursor-pointer transition-colors group
              ${activeTabId === tab.id ? 'bg-[#FFA500] text-white shadow-sm' : 'bg-black/10 text-white/80 hover:bg-black/20'}
            `}
            onClick={() => setActiveTabId(tab.id)}
          >
            {/* Фавикон */}
            {tab.favicon ? (
              <img src={tab.favicon} alt="" className="w-4 h-4 mr-2" />
            ) : (
              <div className="w-4 h-4 mr-2 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14.5A6.5 6.5 0 118 1.5a6.5 6.5 0 010 13z" />
                </svg>
              </div>
            )}

            {/* Заголовок */}
            <span className="flex-1 text-xs truncate mr-4">
              {tab.title || 'Загрузка...'}
            </span>

            {/* Кнопка закрытия */}
            <button
              className="absolute right-1 opacity-0 group-hover:opacity-100 hover:bg-black/20 rounded p-0.5 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                <path d="M3 3l6 6M9 3l-6 6" strokeWidth="1.5" />
              </svg>
            </button>

            {/* Индикатор загрузки */}
            {tab.isLoading && (
              <div className="absolute bottom-0 left-0 h-0.5 bg-green-400 w-full animate-pulse" />
            )}
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {/* Кнопка новой вкладки */}
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
        whileTap={{ scale: 0.9 }}
        onClick={() => addTab()}
        className="flex items-center justify-center w-8 h-8 rounded-full text-white transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8 3v10M3 8h10" />
        </svg>
      </motion.button>
    </div>
  );
};
