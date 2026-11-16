import { useState, type ClipboardEvent, type FormEvent } from 'react'
import { useAuth } from './AuthContext'
import { REPO, TOKEN_CREATE_URL, TOKEN_SCOPES } from '../config'

export function LoginScreen() {
  const { login, status, error } = useAuth()
  const [value, setValue] = useState('')
  const busy = status === 'validating'

  function submit(e: FormEvent) {
    e.preventDefault()
    const token = value.trim()
    if (token) login(token)
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    if (busy) return
    const pasted = e.clipboardData.getData('text').trim()
    if (!pasted) return
    // Paste the whole token straight in and sign in — no extra click.
    e.preventDefault()
    setValue(pasted)
    login(pasted)
  }

  return (
    <div className="login">
      <form className="box login__box" onSubmit={submit}>
        <h1 className="login__title">Sign in</h1>
        <p className="login__subtitle">
          Authenticate with a GitHub personal access token to use{' '}
          <strong>
            {REPO.owner}/{REPO.repo}
          </strong>
          .
        </p>

        <label className="field">
          <span className="field__label">Personal access token</span>
          <input
            className="input"
            type="password"
            autoComplete="off"
            autoFocus
            placeholder="Paste a token to sign in"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onPaste={onPaste}
            disabled={busy}
          />
        </label>

        {error && <p className="flash flash--error">{error}</p>}

        <button className="btn btn--primary btn--block" disabled={busy || !value.trim()}>
          {busy ? 'Validating…' : 'Sign in'}
        </button>

        <p className="login__hint">
          This app needs a token with the{' '}
          <code>{TOKEN_SCOPES.join(', ')}</code> scope
          {TOKEN_SCOPES.length > 1 ? 's' : ''}. Adapt the required rights to what your app
          actually does.{' '}
          <a href={TOKEN_CREATE_URL} target="_blank" rel="noreferrer">
            Create a token with {TOKEN_SCOPES.length > 1 ? 'these scopes' : 'this scope'} ↗
          </a>
        </p>
      </form>
    </div>
  )
}
