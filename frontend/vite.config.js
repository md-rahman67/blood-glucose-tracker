import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const backendEnvPath = fileURLToPath(new URL('../backend/', import.meta.url))
  const { PORT = '3000' } = loadEnv(mode, backendEnvPath, 'PORT')

  return {
    server: {
      proxy: {
        '/api': {
          target: `http://localhost:${PORT}`,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    plugins: [react()],
  }
})
