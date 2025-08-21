import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  // Use env variable for base (defaults to "/")
  base: process.env.VITE_APP_BASE || '/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    // instead of historyApiFallback (webpack), Vite uses middlewareMode
    historyApiFallback: true,
  },
})