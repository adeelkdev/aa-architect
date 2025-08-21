import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  // Important: must match your repo name for GitHub Pages
  base: '/aa-architect/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // make sure nothing is accidentally excluded
      external: [],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // helps prevent broken SPA routing on reload
  server: {
    historyApiFallback: true,
  },
})