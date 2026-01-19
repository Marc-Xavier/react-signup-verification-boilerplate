import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'classic'
  })],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'config': path.resolve(__dirname, './src/config.js')
    },
    extensions: ['.js', '.jsx']
  },

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },

  server: {
    port: 8080,
    open: true
  },

  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
