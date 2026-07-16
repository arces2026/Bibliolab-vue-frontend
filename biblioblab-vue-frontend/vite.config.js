import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      //Tutte le richieste a /api vengono girate a Django
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/,'') ← se Django non ha /api/ prefix
      },
      // gira anche le risorse media/static di Django
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    },
  },
})
