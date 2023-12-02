import path from 'path';
import react from '@vitejs/plugin-react';
import checker from 'vite-plugin-checker';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    checker({
      // e.g. use TypeScript check
      typescript: true,
    }),
  ],
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
    // https://stackoverflow.com/questions/70694187/vite-server-is-running-but-not-working-on-localhost
    host: '0.0.0.0',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
