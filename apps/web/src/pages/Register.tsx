import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })
            const data = await response.json()
            if (!response.ok) throw new Error(data.message || 'Erro ao cadastrar')
            navigate('/login')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ backgroundColor: '#f5fbf5', fontFamily: 'Manrope, sans-serif' }}
        >
            <main className="w-full max-w-[400px] flex flex-col gap-8">
                {/* Brand */}
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#008560' }}>
                        <span className="text-white text-4xl">🌱</span>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight" style={{ color: '#171d1a' }}>Smart Farm</h1>
                    <p className="text-sm" style={{ color: '#3d4943' }}>Crie sua conta para começar</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl p-8 shadow-sm border" style={{ borderColor: 'rgba(188, 202, 193, 0.3)' }}>
                    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>

                        {error && (
                            <div className="p-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">
                                {error}
                            </div>
                        )}

                        {/* Name */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium tracking-wide uppercase" style={{ color: '#3d4943' }}>Nome</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Seu nome"
                                required
                                className="w-full px-4 py-3 border rounded-lg text-sm outline-none transition-all"
                                style={{ borderColor: '#bccac1', color: '#171d1a' }}
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium tracking-wide uppercase" style={{ color: '#3d4943' }}>E-mail</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nome@exemplo.com"
                                required
                                className="w-full px-4 py-3 border rounded-lg text-sm outline-none transition-all"
                                style={{ borderColor: '#bccac1', color: '#171d1a' }}
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium tracking-wide uppercase" style={{ color: '#3d4943' }}>Senha</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 border rounded-lg text-sm outline-none transition-all"
                                style={{ borderColor: '#bccac1', color: '#171d1a' }}
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg font-bold text-white transition-all"
                            style={{ backgroundColor: '#008560' }}
                        >
                            {loading ? 'Cadastrando...' : 'Cadastrar'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <footer className="text-center">
                    <p className="text-sm" style={{ color: '#3d4943' }}>
                        Já tem conta?{' '}
                        <a href="/login" className="font-bold" style={{ color: '#00694c' }}>Entrar</a>
                    </p>
                </footer>
            </main>
        </div>
    )
}