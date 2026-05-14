import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Кастомный заголовок окна с кнопками управления
export const TitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // Получаем начальное состояние
    window.electronAPI?.isMaximized().then(setIsMaximized);

    // Подписываемся на изменения состояния окна
    window.electronAPI?.onWindowStateChanged((state: any) => {
      if (state.isMaximized !== undefined) setIsMaximized(state.isMaximized);
    });
  }, []);

  return (
    <div
      className="flex items-center justify-between h-8 px-3 drag-region"
      style={{ background: 'var(--toolbar-bg, linear-gradient(135deg, #FF8C00, #FFA500))' }}
    >
      {/* Логотип и название */}
      <div className="flex items-center gap-2 no-drag">
        <img src="/assets/icon.png" alt="Besplatno Browser" className="w-5 h-5 rounded" />
        <span className="text-white text-xs font-semibold">Besplatno Browser</span>
      </div>

      {/* Кнопки управления окном */}
      <div className="flex items-center gap-1 no-drag">
        {/* Свернуть */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.electronAPI?.minimizeWindow()}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/20 text-white transition-colors"
          title="Свернуть"
        >
          <svg width="10" height="1" viewBox="0 0 10 1" fill="currentColor">
            <rect width="10" height="1" />
          </svg>
        </motion.button>

        {/* Развернуть / Восстановить */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.electronAPI?.maximizeWindow()}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/20 text-white transition-colors"
          title={isMaximized ? 'Восстановить' : 'Развернуть'}
        >
          {isMaximized ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="2" y="0" width="8" height="8" />
              <rect x="0" y="2" width="8" height="8" fill="var(--toolbar-bg)" />
              <rect x="0" y="2" width="8" height="8" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="0" y="0" width="10" height="10" />
            </svg>
          )}
        </motion.button>

        {/* Закрыть */}
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.8)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.electronAPI?.closeWindow()}
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/80 text-white transition-colors"
          title="Закрыть"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="0" y1="0" x2="10" y2="10" />
            <line x1="10" y1="0" x2="0" y2="10" />
          </svg>
        </motion.button>
      </div>
    </div>
  );
};
