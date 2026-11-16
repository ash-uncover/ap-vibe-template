import { Link } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { DEMO_FILE } from '../config'

export function Home() {
  const { repo, writeAccess } = useAuth()
  if (!repo) return null

  return (
    <div className="stack">
      <section className="box">
        <div className="box__header">
          <h2 className="box__title">
            <a href={repo.html_url} target="_blank" rel="noreferrer">
              {repo.full_name}
            </a>
          </h2>
          <span className={`badge ${repo.private ? 'badge--gray' : 'badge--green'}`}>
            {repo.private ? 'Private' : 'Public'}
          </span>
        </div>
        <div className="box__body">
          <p className="muted">{repo.description ?? 'No description provided.'}</p>
          <ul className="meta">
            <li>★ {repo.stargazers_count}</li>
            <li>
              Default branch: <code>{repo.default_branch}</code>
            </li>
            <li>
              Token access: <strong>{writeAccess ? 'read / write' : 'read only'}</strong>
            </li>
          </ul>
        </div>
      </section>

      <section className="box">
        <div className="box__body">
          <h3 className="box__title">Demo — read &amp; write a file</h3>
          <p className="muted">
            Open <code>{DEMO_FILE}</code> from this repository, edit it, and commit the
            change back through the GitHub API. This exercises the full read + write loop
            and the read-only / write-access distinction.
          </p>
          <Link to="/edit" className="btn btn--primary">
            Open the editor →
          </Link>
        </div>
      </section>
    </div>
  )
}
