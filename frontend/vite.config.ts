import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import fs from 'fs'
import path from 'path'

const pemPath = path.resolve(__dirname, '../backend/baeldung.pem')
const pem = fs.readFileSync(pemPath)

export default defineConfig({
  base: '/~s369037/',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://ubuntu22:8443',
        changeOrigin: true,
        secure: false
      },
    },
    host: '0.0.0.0',
    https: {
      key: pem,
      cert: pem
    }

  },
})