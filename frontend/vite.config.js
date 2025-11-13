import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // <- ubah ke API Gateway di docker-compose
        changeOrigin: true,
        secure: false,
        // pathRewrite tidak diperlukan karena gateway mendengarkan /api/...
      }
    }
  }
})