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
        '~backend/client': path.resolve(__dirname, './backend.ts'),
        '~backend': path.resolve(__dirname, '../backend'),
      },
    },
    plugins: [
      tailwindcss(),
      react(),
    ],
    server: {
      host: true, // Allow external access (for ngrok/tunnel)
      allowedHosts: true, // Allow Cloudflare tunnel hostnames
      hmr: {
        overlay: false,
      },
      proxy: {
        // Encore backend (port 4000)
        '/users': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
        '/progress': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
        '/reading': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
        '/listening': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
        '/speaking': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
        '/vocabulary': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
        '/ai': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
        '/essay-limits': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
        '/writing/prompt': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
        '/writing/sessions': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
        '/writing/submit': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
        '/ielts': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },

        // FastAPI Python backend (port 8002)
        '/task1': {
          target: 'http://localhost:8002',
          changeOrigin: true,
        },
        '/task2': {
          target: 'http://localhost:8002',
          changeOrigin: true,
        },
        '/writing/history': {
          target: 'http://localhost:8002',
          changeOrigin: true,
        },
        '/api/onboarding': {
          target: 'http://localhost:8002',
          changeOrigin: true,
        },
        '/podcast-summary': {
          target: 'http://localhost:8002',
          changeOrigin: true,
        },

        // AI Tutor backend (port 8001)
        '/api/chat': {
          target: 'http://localhost:8001',
          changeOrigin: true,
        },
        '/api/reading': {
          target: 'http://localhost:8001',
          changeOrigin: true,
        },
        '/api/feedback': {
          target: 'http://localhost:8001',
          changeOrigin: true,
        },
        '/api/training': {
          target: 'http://localhost:8001',
          changeOrigin: true,
        },
      },
    },
    build: {
      minify: isBuild ? 'esbuild' : false,
      outDir: '../backend/frontend/dist',
    },
  }
})
