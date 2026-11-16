import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { GitHubClient } from '../github/client'
import type { GitHubError, Repo } from '../github/types'
import { STORAGE_KEY } from '../config'

type Status = 'idle' | 'validating' | 'authenticated' | 'error'

interface AuthState {
  token: string | null
  client: GitHubClient | null
  repo: Repo | null
  writeAccess: boolean
  status: Status
  error: string | null
  /** True only during the initial validation of a token restored from storage. */
  initializing: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [repo, setRepo] = useState<Repo | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState<string | null>(null)
  const [initializing, setInitializing] = useState<boolean>(
    () => Boolean(localStorage.getItem(STORAGE_KEY)),
  )

  async function login(candidate: string): Promise<void> {
    setStatus('validating')
    setError(null)
    try {
      const probe = new GitHubClient(candidate)
      const info = await probe.request<Repo>('')
      setToken(candidate)
      setRepo(info)
      setStatus('authenticated')
      localStorage.setItem(STORAGE_KEY, candidate)
    } catch (e) {
      const err = e as GitHubError
      setToken(null)
      setRepo(null)
      setStatus('error')
      setError(
        err.status === 401
          ? 'Invalid or expired token.'
          : err.status === 404
            ? 'Token is valid but cannot see this repository.'
            : (err.message ?? 'Authentication failed.'),
      )
      localStorage.removeItem(STORAGE_KEY)
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      login(saved).finally(() => setInitializing(false))
    }
    // Intentionally run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function logout() {
    setToken(null)
    setRepo(null)
    setStatus('idle')
    setError(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const client = useMemo(() => (token ? new GitHubClient(token) : null), [token])

  const value: AuthState = {
    token,
    client,
    repo,
    writeAccess: repo?.permissions?.push ?? false,
    status,
    error,
    initializing,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
