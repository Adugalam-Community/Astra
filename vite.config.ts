import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { metaWebhookServerPlugin } from './src/services/viteWebhookPlugin';

export default defineConfig({
  plugins: [
    react(),
    metaWebhookServerPlugin()
  ],
  server: {
    port: 3000,
    open: false
  }
});
