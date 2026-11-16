import { Navigate, Route, Routes } from 'react-router'
import { useAuth } from './auth/AuthContext'
import { LoginScreen } from './auth/LoginScreen'
import { Layout } from './components/Layout'
import { Home } from './routes/Home'
import { FileEditor } from './routes/FileEditor'

export function App() {
  const { token, initializing } = useAuth()

  if (initializing) {
    return <div className="splash">Authenticating…</div>
  }

  if (!token) {
    return <LoginScreen />
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="edit" element={<FileEditor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
