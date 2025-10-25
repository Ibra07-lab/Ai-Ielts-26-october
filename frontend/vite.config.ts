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
    },
    build: {
      minify: false,
    },
  }
})
