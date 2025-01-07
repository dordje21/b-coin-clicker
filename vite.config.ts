import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: true,
    proxy: {
      '/api/bridge': {
        target: 'https://bridge.ton.space',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bridge/, '/bridge'),
      },
      '/api/tonapi': {
        target: 'https://bridge.tonapi.io',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tonapi/, '/bridge'),
      },
      '/api/delab': {
        target: 'https://sse-bridge.delab.team',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/delab/, '/bridge'),
      },
      '/api/tonconnect': {
        target: 'https://connect.tonhubapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tonconnect/, '/tonconnect'),
      },
    }
  },
  build: {
    outDir: './docs'
  },
  base: ''
});
