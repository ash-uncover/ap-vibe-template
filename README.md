# ap-vibe-template

A minimal starting point for **vibe-coded React applications** that live on GitHub
and talk to the GitHub API on the user's behalf.

This repository is a **template**: fork it (or use it as a GitHub template), point it
at your own repository by editing a single config value, and start building your app.

## What you get

- **React + React Router** app, built with **Vite** and written in **TypeScript**.
- **Centralized repository reference** — the owner/repo the app operates on lives in
  exactly one place (`src/config.ts`). Change it once and the whole app (API calls,
  router base path, Pages URL, build `base`) follows.
- **GitHub PAT authentication** — the user signs in with a Personal Access Token.
  The app detects whether the token is **read-only** or has **write** access and
  adapts the UI accordingly.
- **GitHub Pages deployment** — a GitHub Actions workflow builds and publishes the app
  to Pages on every push to `main`. No build artifacts are committed.
- **A working read + write demo** — an in-repo file editor that reads a file through the
  GitHub Contents API and commits changes back, exercising the full round-trip.

## Stack

| Concern    | Choice                                   |
|------------|------------------------------------------|
| Framework  | React 19                                 |
| Routing    | React Router                             |
| Build tool | Vite                                     |
| Language   | TypeScript (strict)                      |
| API access | Native `fetch` (no Octokit) + GitHub PAT |
| Hosting    | GitHub Pages via GitHub Actions          |

Dependencies are kept deliberately small. Reach for a library only when it is clearly the
right tool.

## Getting started (adopting the template)

1. **Fork / create from template** into your own repository.
2. **Point it at your repo** — edit the single source of truth in `src/config.ts`:
   ```ts
   export const REPO = { owner: 'your-user', repo: 'your-repo' } as const
   ```
   Nothing else needs to change for the app to target a different repository.
3. **Enable GitHub Pages** — in the repo settings, set Pages **Source** to
   **GitHub Actions**.
4. **Push to `main`** — the deploy workflow publishes to
   `https://<owner>.github.io/<repo>/`.

## Local development

```bash
npm install
npm run dev        # Vite dev server
npm run build      # production build into dist/
npm run preview    # preview the production build locally
```

## Authentication

The app authenticates with a **GitHub Personal Access Token** that the user pastes into the
login screen. The token is stored in `localStorage`.

- On login the app calls the GitHub API to determine whether the token grants **write**
  (`permissions.push`) or only **read** access, and reflects that in the UI.
- Read features work with a read-only token; write features (committing changes) require a
  token with write access and are disabled otherwise.
- The **required scopes live in one place** — `TOKEN_SCOPES` in `src/config.ts` — and the
  login screen's "Create a token" link preselects them on GitHub's classic-token page.
  **Adapt `TOKEN_SCOPES` to your app's needs** (least privilege): the template defaults to
  `public_repo` (read/write contents of a public repo); a private repo needs `repo`, and an
  app that does more (workflows, issues, org data) should request exactly the scopes it uses
  — no more. For granular read-only-vs-write control, users can issue a fine-grained token
  instead.

> **Security note:** storing a PAT in `localStorage` is standard for a personal, client-side
> GitHub tool, but the token is readable by any script running on the page. Use a
> fine-grained token scoped to the single repository, and treat the deployed app as you
> would any tool you hand your token to.

## How deployment works

- `.github/workflows/deploy.yml` builds the app and deploys it with the official Pages
  actions on push to `main`.
- Because the app is served from a project subpath (`/<repo>/`), Vite's `base` and the
  React Router `basename` are both derived from `REPO`.
- A `404.html` fallback is emitted at build time so deep links resolve correctly on Pages.

## Project structure

```
src/
  config.ts          Centralized REPO reference (single source of truth)
  main.tsx           App entry, Router with basename
  App.tsx            Routes
  auth/              PAT login, token storage, read/write detection
  github/            fetch client + Contents API helpers (read/write a file)
  routes/            Home + the file-editor demo
```

See `CLAUDE.md` for the conventions to follow when building a real app on top of this
template.
