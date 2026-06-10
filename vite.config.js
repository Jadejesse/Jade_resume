import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Jade_resume/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['framer-motion'],
          react: ['react', 'react-dom', 'react-router-dom'],
          three: ['three'],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
