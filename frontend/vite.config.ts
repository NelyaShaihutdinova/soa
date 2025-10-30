import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/~s369037/',
  plugins: [react()],
  server: {
    port: 3000,
    https: {
      key: './localhost-key.pem',
      cert: './localhost.pem',
    },
    proxy: {
      '/api': {
        target: 'https://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})