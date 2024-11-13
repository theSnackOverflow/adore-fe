import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5173,
    host: "0.0.0.0",
    proxy: {
      '/user': {
        target: 'http://gachon-adore.duckdns.org:8081',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
})