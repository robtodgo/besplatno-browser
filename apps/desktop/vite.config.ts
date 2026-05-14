import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Конфигурация Vite для renderer-процесса Electron
export default defineConfig({
  plugins: [react()],
  root: 'src/renderer',
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer'),
      '@shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist/renderer'),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
