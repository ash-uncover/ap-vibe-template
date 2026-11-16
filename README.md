# ap-vibe-template

A minimal starting point for **vibe-coded React applications** that live on GitHub
and talk to the GitHub API on the user's behalf.

This repository is a **template**: fork it (or use it as a GitHub template), point it
at your own repository by editing a single config value, and start building your app.

## What you get

- **React + React Router** app, built with **Vite** and written in **TypeScript**.
- **Zero-config repository reference** — the owner/repo the app operates on is **resolved
  automatically** (from `GITHUB_REPOSITORY` in the deploy Action, the git remote during
  local dev, or the `*.github.io` URL at runtime). A copied repo works with no edits, and
  everything — API calls, router base path, Pages URL, build `base`, token scopes — follows
  from it. It's all surfaced from one module, `src/config.ts`.
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

1. **Create from template** — use GitHub's **"Use this template → Create a new repository"**
   (the same account is fine). You get a clean repo with no fork relationship.
2. **Enable GitHub Pages** — in the new repo, set Pages **Source** to **GitHub Actions**
   (Settings → Pages).
3. **Push to `main`** — the deploy workflow publishes to
   `https://<owner>.github.io/<repo>/`.

**That's it — no config edits.** The repository reference resolves automatically (from
`GITHUB_REPOSITORY` in the Action, or the git remote in local dev), and the token scope
auto-selects `public_repo` for a public repo or `repo` for a private one. The only thing to
revisit is `TOKEN_SCOPES` in `src/config.ts`, and only if your app needs **more** than
repo-contents access (workflows, issues, org data…).

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
- The **required scopes are resolved in one place** — `TOKEN_SCOPES` in `src/config.ts` —
  and the login screen's "Create a token" link preselects them on GitHub's classic-token
  page. They **auto-select by repository visibility**: `public_repo` for a public repo,
  `repo` for a private one (least privilege for the repo-contents use case). **Widen
  `TOKEN_SCOPES` only if your app does more** (workflows, issues, org data). For granular
  read-only-vs-write control, users can issue a fine-grained token instead.

> **Security note:** storing a PAT in `localStorage` is standard for a personal, client-side
> GitHub tool, but the token is readable by any script running on the page. Use a
> fine-grained token scoped to the single repository, and treat the deployed app as you
> would any tool you hand your token to.

## How deployment works

- `.github/workflows/deploy.yml` builds the app and deploys it with the official Pages
  actions on push to `main`.
- Because the app is served from a project subpath (`/<repo>/`), Vite's `base` and the
  React Router `basename` are both derived from the auto-resolved repo name.
- A `404.html` fallback is emitted at build time so deep links resolve correctly on Pages.

## Project structure

```
src/
  config.ts          Repo reference — auto-resolved; derives API, base, scopes, URLs
  main.tsx           App entry, Router with basename
  App.tsx            Routes
  auth/              PAT login, token storage, read/write detection
  github/            fetch client + Contents API helpers (read/write a file)
  routes/            Home + the file-editor demo
```

See `CLAUDE.md` for the conventions to follow when building a real app on top of this
template.
