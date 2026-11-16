import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import { copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Resolve "owner/repo" automatically so repos copied from this template need no edits:
 *   1. GITHUB_REPOSITORY — set by GitHub Actions during the Pages deploy.
 *   2. git remote — for local dev / manual builds.
 *   3. a last-resort fallback so dev still works before a remote is configured.
 */
function resolveRepoSlug(): string {
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY
  try {
    const url = execSync('git config --get remote.origin.url', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    const match = url.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/)
    if (match) return `${match[1]}/${match[2]}`
  } catch {
    /* not a git checkout, or no remote yet */
  }
  return 'ash-uncover/ap-vibe-template'
}

const slug = resolveRepoSlug()
const repoName = slug.split('/')[1]
// Repo visibility selects the minimal token scope; the deploy workflow passes it.
const isPrivate = process.env.REPO_PRIVATE === 'true'

// https://vite.dev/config/
export default defineConfig({
  // Served from a GitHub Pages project subpath (/<repo>/), derived automatically.
  base: `/${repoName}/`,
  define: {
    __APP_REPO__: JSON.stringify(slug),
    __APP_REPO_PRIVATE__: JSON.stringify(isPrivate),
  },
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
