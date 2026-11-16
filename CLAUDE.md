# CLAUDE.md

Guidance for Claude Code when working in a repository **forked from `ap-vibe-template`**.

If this repo still looks like the bare template, you are bootstrapping. Once it has been
forked into a real project, your job is to **build that project's features on top of the
template's scaffolding** — without breaking the four guarantees below.

## What this project is

A client-side **React + React Router** app, built with **Vite**, written in **TypeScript**,
deployed to **GitHub Pages**, that authenticates with a **GitHub PAT** and operates on a
**single configured repository**. It started from `ap-vibe-template`.

## The four guarantees — do not break these

1. **One resolved repository reference.** `src/config.ts` resolves the target owner/repo
   **automatically** — build-time `__APP_REPO__` (from `GITHUB_REPOSITORY` in the Action, or
   the git remote in dev), with a `*.github.io` runtime fallback. Everything derives from
   `REPO`: GitHub API URLs, the router `basename`, Vite's `base`, the storage key. Never
   hardcode an owner/repo anywhere, and **do not reintroduce a hand-edited constant** — a
   repo copied from this template must work with zero edits.
2. **PAT auth with read/write awareness.** All GitHub access goes through the token the
   user provides. Features that write (commits, PRs, issues…) must be gated on detected
   **write** access and disabled with an explanation when the token is read-only. Read
   features must keep working with a read-only token. The scopes the app asks for are
   resolved in `TOKEN_SCOPES` in `src/config.ts` (auto-selected by repo visibility —
   `public_repo` public, `repo` private — and used to build the token-creation link).
   **Widen them only if your app does more than repo-contents access, requesting the least
   privilege that works**, and never hardcode a scope list elsewhere.
3. **Minimal dependencies.** Prefer native `fetch` and the existing `github/` helpers over
   new packages. Add a dependency only when it is clearly the right tool, and say why.
4. **Pages-safe routing.** The app is served under `/<repo>/`. Use the Router `basename`
   and build `base` derived from `REPO`; keep the `404.html` SPA fallback working. Never
   assume the app is served from the domain root.

## Architecture map

| Path             | Responsibility                                                        |
|------------------|-----------------------------------------------------------------------|
| `src/config.ts`  | Resolves `REPO` automatically; derives `API_BASE`, scopes, URLs.      |
| `src/main.tsx`   | Entry point; mounts Router with `basename={BASE_PATH}`.               |
| `src/App.tsx`    | Route table.                                                          |
| `src/auth/`      | PAT login, `localStorage` persistence, write-access detection, context.|
| `src/github/`    | `client.ts` (thin authenticated `fetch` wrapper) + Contents API helpers.|
| `src/routes/`    | Screens. Add new features here as routes.                             |

## Commands

```bash
npm install
npm run dev        # Vite dev server
npm run build      # production build (emits dist/ + 404.html fallback)
npm run preview    # preview the production build
```

Verify a change with `npm run build` before claiming it works; the build type-checks.

## How to add a feature

1. Add a route under `src/routes/` and register it in `src/App.tsx`.
2. Make all GitHub calls through `src/github/client.ts` so the PAT and base URL are applied
   consistently — do not call `api.github.com` directly from components.
3. For writes, check the auth context's write flag and disable the action when the token is
   read-only. Surface a clear reason, don't fail silently.
4. Keep repository identity flowing from the resolved `REPO` — if you need another
   owner/repo, that is a signal to extend `config.ts`, not to inline a string.

## Conventions

- **TypeScript strict**; no `any` — use generics, `unknown`, or explicit interfaces.
- **Functional components only**; hooks for state. No class components.
- Co-locate component styles; keep modules small and single-purpose.
- Model GitHub API responses with explicit interfaces in `src/github/`.
- Keep handlers/components thin; put API and business logic in `src/github/` or dedicated
  modules.

## Deployment

- Push to `main` triggers `.github/workflows/deploy.yml`, which builds and deploys to Pages.
- Pages **Source** must be set to **GitHub Actions** in repo settings (one-time).
- Do not commit `dist/`. The workflow produces and uploads it.

## What not to do

- Don't hardcode the owner/repo, the Pages URL, or `/<repo>/` paths outside `config.ts`.
- Don't bypass the auth layer or the `github/` client.
- Don't add state-management, UI, or data libraries without a concrete need.
- Don't switch the app to assume root-path hosting; it runs under a project subpath.
