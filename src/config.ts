/**
 * Repository reference — resolved automatically, so a repo copied from this template
 * needs no edits here.
 *
 * Resolution order:
 *   1. Build time: `__APP_REPO__` is baked in from GITHUB_REPOSITORY (GitHub Actions) or
 *      the git remote (local dev) — see vite.config.ts.
 *   2. Runtime fallback: parse https://<owner>.github.io/<repo>/ from the URL.
 */
function resolveRepo(): { owner: string; repo: string } {
  if (typeof __APP_REPO__ === 'string' && __APP_REPO__.includes('/')) {
    const [owner, repo] = __APP_REPO__.split('/')
    return { owner, repo }
  }
  const host = location.hostname
  const segment = location.pathname.split('/').filter(Boolean)[0]
  if (host.endsWith('.github.io') && segment) {
    return { owner: host.slice(0, -'.github.io'.length), repo: segment }
  }
  throw new Error('Unable to resolve the GitHub repository for this app.')
}

export const REPO = resolveRepo()

/** Router basename / asset base — comes from Vite `base`, which is also repo-derived. */
export const BASE_PATH = import.meta.env.BASE_URL

/** Repo-scoped GitHub REST API root, e.g. https://api.github.com/repos/owner/repo */
export const API_BASE = `https://api.github.com/repos/${REPO.owner}/${REPO.repo}`

/** File used by the read/write demo. */
export const DEMO_FILE = 'data/notes.md'

/** localStorage key for the PAT, namespaced per repo (Pages share one origin). */
export const STORAGE_KEY = `${REPO.owner}/${REPO.repo}:pat`

/**
 * Classic-token scopes required for the contents read/write this template does.
 * Auto-selected by repository visibility (baked in at build): a public repo needs
 * `public_repo`, a private repo needs `repo`. If YOUR app does more (workflows, issues,
 * org data), widen this list — it is the one auth knob to review per app.
 */
export const TOKEN_SCOPES: readonly string[] = __APP_REPO_PRIVATE__
  ? ['repo']
  : ['public_repo']

/** GitHub classic-token creation URL, with the required scopes and a description preselected. */
export const TOKEN_CREATE_URL =
  'https://github.com/settings/tokens/new' +
  `?description=${encodeURIComponent(REPO.repo)}` +
  `&scopes=${TOKEN_SCOPES.join(',')}`
