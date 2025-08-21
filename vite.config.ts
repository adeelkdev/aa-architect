import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  base: '/aa-architect/', // <-- repo name
  build: {
    rollupOptions: {
      external: [], // ensure nothing is treated as external
    },
  },
    resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})