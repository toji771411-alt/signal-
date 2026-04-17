import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Tasks from './pages/Tasks'
import Assistant from './pages/Assistant'
import Settings from './pages/Settings'
import Network from './pages/Network'
import useAuthStore from './store/authStore'

export default function App() {
  const { init } = useAuthStore()

  useEffect(() => {
    const unsub = init()
    return () => typeof unsub === 'function' && unsub()
  }, [])

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppShell />}>
        <Route path="/feed" element={<Feed />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/assistant" element={<Assistant />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/feed" replace />} />
    </Routes>
  )
}
