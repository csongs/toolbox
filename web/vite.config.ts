import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404',
      closeBundle() {
        // SPA fallback: GitHub Pages serves 404.html for unknown paths,
        // allowing React Router to handle client-side routing
        fs.copyFileSync(
          path.resolve(__dirname, 'dist', 'index.html'),
          path.resolve(__dirname, 'dist', '404.html')
        )
      },
    },
  ],
  base: '/toolbox/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
