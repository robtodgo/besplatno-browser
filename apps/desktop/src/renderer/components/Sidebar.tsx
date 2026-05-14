import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Кнопка открытия сайдбара */}
      <div className="absolute left-0 top-0 bottom-0 w-1 group z-50">
        <div 
          className="h-full w-full hover:bg-orange-500/50 cursor-pointer transition-colors"
          onMouseEnter={() => setIsOpen(true)}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            onMouseLeave={() => setIsOpen(false)}
            className="absolute left-0 top-0 bottom-0 w-64 bg-white/95 backdrop-blur-md border-r border-orange-200 shadow-2xl z-50 flex flex-col"
          >
            <div className="p-4 border-b border-orange-100 flex items-center justify-between bg-orange-50">
              <span className="font-bold text-orange-600">Besplatno</span>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-orange-500">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <SidebarItem icon="⭐" label="Закладки" />
              <SidebarItem icon="🕒" label="История" />
              <SidebarItem icon="📥" label="Загрузки" />
              <SidebarItem icon="🧩" label="Расширения" />
              <div className="my-2 border-t border-orange-50" />
              <SidebarItem icon="⚙️" label="Настройки" />
              <SidebarItem icon="🛡️" label="Приватность" />
            </div>

            <div className="p-4 bg-orange-50 text-[10px] text-gray-400 text-center">
              Besplatno Browser v1.0.0
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarItem: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-100 text-gray-700 hover:text-orange-700 transition-colors text-sm font-medium">
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </button>
);
