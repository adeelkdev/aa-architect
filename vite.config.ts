// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const host = (env.VITE_DATABRICKS_HOST || '').replace(/\/$/, '')
  const token = env.VITE_DATABRICKS_TOKEN || ''

  return {
    plugins: [react()],
    base: env.VITE_APP_BASE || '/aa-architect/',
    resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
    server: {
      proxy: {
        '/dbx': {
          target: host,          // e.g. https://dbc-xxxx.cloud.databricks.com
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/dbx/, ''),
          configure(proxy) {
            proxy.on('proxyReq', (proxyReq) => {
              if (token) {
                proxyReq.setHeader('authorization', `Bearer ${token}`)
              }
              proxyReq.setHeader('content-type', 'application/json')
            })
          },
        },
      },
    },
  }
})