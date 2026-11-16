import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import { DEMO_FILE } from '../config'
import { getFile, putFile } from '../github/contents'
import type { GitHubError } from '../github/types'

type LoadState = 'loading' | 'ready' | 'missing' | 'error'

export function FileEditor() {
  const { client, writeAccess, repo } = useAuth()
  const [state, setState] = useState<LoadState>('loading')
  const [error, setError] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [sha, setSha] = useState<string | null>(null)
  const [message, setMessage] = useState(`Update ${DEMO_FILE}`)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    if (!client) return
    setState('loading')
    setError(null)
    setFlash(null)
    try {
      const file = await getFile(client, DEMO_FILE, repo?.default_branch)
      setText(file.text)
      setSha(file.sha)
      setState('ready')
    } catch (e) {
      const err = e as GitHubError
      if (err.status === 404) {
        setText('')
        setSha(null)
        setState('missing')
      } else {
        setState('error')
        setError(err.message ?? 'Failed to load file.')
      }
    }
  }, [client, repo?.default_branch])

  useEffect(() => {
    load()
  }, [load])

  async function save() {
    if (!client) return
    setSaving(true)
    setError(null)
    setFlash(null)
    try {
      const res = await putFile(client, DEMO_FILE, text, sha, message, repo?.default_branch)
      setSha(res.sha)
      setState('ready')
      setFlash('Committed ✓')
    } catch (e) {
      const err = e as GitHubError
      setError(err.message ?? 'Commit failed.')
    } finally {
      setSaving(false)
    }
  }

  const editable = state === 'ready' || state === 'missing'

  return (
    <div className="stack">
      <section className="box">
        <div className="box__header">
          <h2 className="box__title">
            <code>{DEMO_FILE}</code>
          </h2>
          <button
            className="btn btn--default btn--sm"
            onClick={load}
            disabled={state === 'loading'}
          >
            Reload
          </button>
        </div>

        <div className="box__body">
          {state === 'loading' && <p className="muted">Loading…</p>}

          {state === 'error' && <p className="flash flash--error">{error}</p>}

          {state === 'missing' && (
            <p className="flash flash--warn">
              <code>{DEMO_FILE}</code> doesn’t exist yet.{' '}
              {writeAccess
                ? 'Type below and commit to create it.'
                : 'A write-access token is needed to create it.'}
            </p>
          )}

          {editable && (
            <>
              <textarea
                className="editor"
                value={text}
                onChange={(e) => setText(e.target.value)}
                spellCheck={false}
                rows={16}
              />

              <label className="field">
                <span className="field__label">Commit message</span>
                <input
                  className="input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </label>

              {error && <p className="flash flash--error">{error}</p>}
              {flash && <p className="flash flash--success">{flash}</p>}

              <div className="row">
                <button
                  className="btn btn--primary"
                  onClick={save}
                  disabled={!writeAccess || saving || !message.trim()}
                  title={writeAccess ? '' : 'Read-only token: committing is disabled'}
                >
                  {saving ? 'Committing…' : 'Commit changes'}
                </button>
                {!writeAccess && (
                  <span className="muted">
                    Your token is read-only — commits are disabled.
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
