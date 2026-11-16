import { API_BASE } from '../config'
import type { GitHubError } from './types'

/**
 * Thin authenticated wrapper around the GitHub REST API. Every request is scoped
 * to the configured repository (API_BASE) and carries the user's PAT. All GitHub
 * access in the app should go through this client — never call api.github.com
 * directly from components.
 */
export class GitHubClient {
  readonly #token: string

  constructor(token: string) {
    this.#token = token
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${this.#token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    }
    if (init.body) {
      headers['Content-Type'] = 'application/json'
    }

    const res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { ...headers, ...(init.headers as Record<string, string> | undefined) },
    })

    if (!res.ok) {
      let message = res.statusText
      try {
        const body = await res.json()
        if (body?.message) message = body.message
      } catch {
        /* non-JSON error body */
      }
      const error: GitHubError = { status: res.status, message }
      throw error
    }

    if (res.status === 204) {
      return undefined as T
    }
    return (await res.json()) as T
  }
}
