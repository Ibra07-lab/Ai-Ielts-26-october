import { defineConfig } from 'vite'
import * as path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  const isBuild = command === 'build'
  return {
    base: isBuild ? '/frontend/' : '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname),
        '~backend/client': path.resolve(__dirname, './client'),
        '~backend': path.resolve(__dirname, '../backend'),
      },
    },
    plugins: [
      tailwindcss(),
      react(),
    ],
    server: {
      hmr: {
        overlay: false,
      },
      proxy: {
        '/progress': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
        // Optional: also proxy user progress/daily-goal if needed from same-origin
        '/users': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
    build: {
      minify: false,
    },
  }
})
