import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 5173, // 개발 서버 포트
    host: '0.0.0.0', // 모든 네트워크 인터페이스에서 접근 가능
    proxy: {
      '/api': {
        target: 'http://gachon-adore.duckdns.org:8111', // 백엔드 API 서버 URL
        changeOrigin: true, // Origin 헤더 변경
        secure: false, // HTTPS 인증서 검증 무시 (테스트 환경에서만 사용)
        rewrite: (path) => path.replace(/^\/api/, ''), // `/api` 제거하여 백엔드에 전달
      }
    }
  },
  plugins: [react()], // React 플러그인
});