import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
  // Removed server.proxy configuration
=======
  resolve: {
    alias: {
      i18next: path.resolve(__dirname, 'node_modules/i18next/dist/esm/i18next.js')
    }
  },
>>>>>>> 50c8e4ca2e63e5f21c693c0d67f10e86a7db30cd
  // build: { // Remove build options
  //   rollupOptions: {
  //     external: ['i18next']
  //   }
  // }
})
