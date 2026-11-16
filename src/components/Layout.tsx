import { Link, Outlet } from 'react-router'
import { useAuth } from '../auth/AuthContext'
import { REPO } from '../config'

export function Layout() {
  const { writeAccess, logout } = useAuth()

  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          <Link to="/" className="app-header__brand">
            <span className="app-header__mark" aria-hidden>
              ◳
            </span>
            <span>
              {REPO.owner}/<strong>{REPO.repo}</strong>
            </span>
          </Link>

          <nav className="app-header__nav">
            <Link to="/">Home</Link>
            <Link to="/edit">Editor</Link>
          </nav>

          <div className="app-header__right">
            <span className={`badge ${writeAccess ? 'badge--green' : 'badge--gray'}`}>
              {writeAccess ? 'read / write' : 'read only'}
            </span>
            <button className="btn btn--default btn--sm" onClick={logout}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </>
  )
}
