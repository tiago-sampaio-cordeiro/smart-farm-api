import { createContext, useContext, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
    token: string | null
    isAuthenticated: boolean
    login: (token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
    const navigate = useNavigate()

    const isAuthenticated = !!token

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken)
        setToken(newToken)
        navigate('/dashboard')
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        navigate('/login')
    }

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth deve ser usado dentro do AuthProvider')
    return context
}