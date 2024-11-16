import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'https://gachon-adore.duckdns.org', // API server URL
        changeOrigin: true, // Modify the Origin header to match the target
        secure: true, // If using HTTPS
        rewrite: (path) => path.replace(/^\/api/, '') // Remove `/api` from the start of the path
      }
    }
  },
  plugins: [react()],
});