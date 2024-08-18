import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  base: './', // important for Electron
  build: {
    outDir: '../build', // output dir relative to the Electron main process
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
    },
  },
});
