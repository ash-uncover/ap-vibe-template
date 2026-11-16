/**
 * Centralized repository reference — the single source of truth for which repo
 * this app operates on. A repo forked from ap-vibe-template changes only `REPO`;
 * everything else (API URLs, router base path, Pages URL, Vite `base`) derives
 * from it. `vite.config.ts` imports `BASE_PATH` from here too — keep it that way.
 */
export const REPO = {
  owner: 'ash-uncover',
  repo: 'ap-vibe-template',
} as const

/** Vite `base` and React Router `basename` — the app is served from /<repo>/ on Pages. */
export const BASE_PATH = `/${REPO.repo}/`

/** Repo-scoped GitHub REST API root, e.g. https://api.github.com/repos/owner/repo */
export const API_BASE = `https://api.github.com/repos/${REPO.owner}/${REPO.repo}`

/** File used by the read/write demo. */
export const DEMO_FILE = 'data/notes.md'

/** localStorage key for the PAT, namespaced per repo (Pages share one origin). */
export const STORAGE_KEY = `${REPO.owner}/${REPO.repo}:pat`

/**
 * Classic-token scopes this app requires. ADAPT THIS to your app's needs — request the
 * least privilege that works, nothing more:
 *   - `public_repo` → read / write contents of PUBLIC repos (the template default)
 *   - `repo`        → read / write contents of PRIVATE repos
 *   - add others (e.g. `workflow`, `read:org`, `gist`) only if your app actually uses them
 *
 * A read-only app targeting a public repo needs no scope at all; one targeting a private
 * repo still needs `repo`, since classic private access is all-or-nothing. For finer,
 * read-only-vs-write control, issue a fine-grained token instead (its permissions can't be
 * preselected by URL, so TOKEN_CREATE_URL below targets the classic-token page).
 */
export const TOKEN_SCOPES = ['public_repo'] as const

/** GitHub classic-token creation URL, with the required scopes and a description preselected. */
export const TOKEN_CREATE_URL =
  'https://github.com/settings/tokens/new' +
  `?description=${encodeURIComponent(REPO.repo)}` +
  `&scopes=${TOKEN_SCOPES.join(',')}`

