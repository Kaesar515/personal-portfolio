import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
  // Removed server.proxy configuration
  // build: { // Remove build options
  //   rollupOptions: {
  //     external: ['i18next']
  //   }
  // }
})
