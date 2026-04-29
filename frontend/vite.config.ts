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
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/progress': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/reading': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/listening': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/speaking': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/vocabulary': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/ai': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/essay-limits': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/writing/prompt': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/writing/sessions': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/writing/submit': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/ielts': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/admin/stats': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },

        // FastAPI Python backend (port 8002)
        '/task1': {
          target: 'http://localhost:8002',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/task2': {
          target: 'http://localhost:8002',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/writing/history': {
          target: 'http://localhost:8002',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/api/onboarding': {
          target: 'http://localhost:8002',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/podcast-summary': {
          target: 'http://localhost:8002',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },

        // AI Tutor backend (port 8001)
        '/api/chat': {
          target: 'http://localhost:8001',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/api/reading': {
          target: 'http://localhost:8001',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/api/feedback': {
          target: 'http://localhost:8001',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
        '/api/training': {
          target: 'http://localhost:8001',
          changeOrigin: true,
          bypass: (req) => {
            if (req.headers.accept?.includes('text/html')) {
              return '/index.html';
            }
          }
        },
      },
    },
    build: {
      minify: isBuild ? 'esbuild' : false,
      outDir: '../backend/frontend/dist',
    },
  }
})

