import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      i18next: path.resolve(__dirname, 'node_modules/i18next/dist/esm/i18next.js')
    }
  },
  // build: { // Remove build options
  //   rollupOptions: {
  //     external: ['i18next']
  //   }
  // }
})
