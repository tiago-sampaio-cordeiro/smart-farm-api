import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AuthCallback from './pages/AuthCallback'
import Farms from './pages/Farms'
import { type ReactNode } from 'react'
import Sensors from './pages/Sensors'
import Measurements from './pages/Measurements'

function PrivateRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, token } = useAuth()
  console.log('isAuthenticated:', isAuthenticated)
  console.log('token:', token)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={< Login />} />
      <Route path="/login" element={< Login />} />
      <Route path="/register" element={< Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/farms" element={
        <PrivateRoute>
          <Farms />
        </PrivateRoute>
      } />
      <Route path="/sensors" element={
        <PrivateRoute>
          <Sensors />
        </PrivateRoute>
      } />
      <Route path="/measurements" element={
        <PrivateRoute>
          <Measurements />
        </PrivateRoute>
      } />
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App