import React, { useState, useEffect } from 'react';
import { useTabStore } from '../stores/tabStore';
import { motion } from 'framer-motion';

export const AddressBar: React.FC = () => {
  const { tabs, activeTabId } = useTabStore();
  const activeTab = tabs.find(t => t.id === activeTabId);
  
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (activeTab && !isFocused) {
      setInputValue(activeTab.url === 'about:blank' ? '' : activeTab.url);
    }
  }, [activeTab, isFocused]);

  const handleNavigate = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim()) {
      window.electronAPI?.navigate(inputValue, activeTabId || undefined);
      (document.activeElement as HTMLElement)?.blur();
    }
  };

  return (
    <div className="flex items-center gap-2 bg-[#FF8C00] p-2 shadow-md">
      {/* Кнопки навигации */}
      <div className="flex items-center gap-1">
        <NavButton 
          icon={<path d="M10 14l-6-6 6-6" />} 
          onClick={() => window.electronAPI?.goBack()} 
          title="Назад"
        />
        <NavButton 
          icon={<path d="M6 14l6-6-6-6" />} 
          onClick={() => window.electronAPI?.goForward()} 
          title="Вперёд"
        />
        <NavButton 
          icon={activeTab?.isLoading ? (
            <path d="M4 4l8 8M12 4l-8 8" />
          ) : (
            <path d="M14 8a6 6 0 11-12 0 6 6 0 0112 0z M14 8h-2" />
          )} 
          onClick={() => activeTab?.isLoading ? window.electronAPI?.stop() : window.electronAPI?.reload()} 
          title={activeTab?.isLoading ? "Остановить" : "Обновить"}
        />
      </div>

      {/* Поле ввода URL */}
      <form onSubmit={handleNavigate} className="flex-1 relative group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Введите адрес или поисковый запрос Yahoo!"
          className={`
            w-full h-9 px-4 rounded-full bg-white/90 text-sm text-gray-800 outline-none border-2 transition-all
            ${isFocused ? 'border-green-500 shadow-lg bg-white' : 'border-transparent group-hover:bg-white'}
          `}
        />
        
        {/* Кнопка Go */}
        {isFocused && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            type="submit"
            className="absolute right-1 top-1 h-7 px-4 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-full transition-colors"
          >
            GO
          </motion.button>
        )}
      </form>

      {/* Доп. кнопки */}
      <div className="flex items-center gap-1">
        <NavButton 
          icon={<path d="M12 2l3 6-6 3-3-6 6-3z M2 12l3 6 6-3-3-6-6 3z" />} 
          onClick={() => {}} 
          title="Расширения"
        />
        <NavButton 
          icon={<path d="M4 6h16M4 12h16M4 18h16" />} 
          onClick={() => {}} 
          title="Меню"
        />
      </div>
    </div>
  );
};

const NavButton: React.FC<{ icon: React.ReactNode; onClick: () => void; title: string }> = ({ icon, onClick, title }) => (
  <motion.button
    whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    title={title}
    className="w-8 h-8 flex items-center justify-center rounded-full text-white transition-colors"
  >
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icon}
    </svg>
  </motion.button>
);
