import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { BASE_PATH } from './src/config.ts'

// https://vite.dev/config/
export default defineConfig({
  // Served from a GitHub Pages project subpath (/<repo>/), derived from src/config.ts.
  base: BASE_PATH,
  plugins: [
    react(),
    {
      // SPA fallback: Pages serves 404.html for unknown deep links; make it the app shell.
      name: 'spa-404-fallback',
      closeBundle() {
        const dist = resolve(import.meta.dirname, 'dist')
        try {
          copyFileSync(resolve(dist, 'index.html'), resolve(dist, '404.html'))
        } catch {
          /* no index.html (non-build command) — nothing to copy */
        }
      },
    },
  ],
})
