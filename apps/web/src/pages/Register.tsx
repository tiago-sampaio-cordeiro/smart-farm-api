import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config/api'

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
            const response = await fetch(`${API_URL}/auth/register`, {
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
        <div className="min-h-screen flex items-start sm:items-center justify-center p-4 bg-[#f5fbf5]">
            <main className="w-full max-w-sm flex flex-col gap-6 sm:gap-8">

                {/* Brand */}
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shadow-sm bg-[#008560]">
                        <span className="text-white text-3xl sm:text-4xl">🌱</span>
                    </div>

                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#171d1a]">
                        Smart Farm
                    </h1>

                    <p className="text-xs sm:text-sm text-[#3d4943]">
                        Crie sua conta para começar
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl p-5 sm:p-8 shadow-sm border border-[#bccac14d]">
                    <form className="flex flex-col gap-5 sm:gap-6" onSubmit={handleSubmit}>

                        {error && (
                            <div className="p-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">
                                {error}
                            </div>
                        )}

                        {/* Name */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium tracking-wide uppercase text-[#3d4943]">
                                Nome
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Seu nome"
                                required
                                className="w-full px-3 sm:px-4 py-3 rounded-lg border border-[#bccac1] text-[#171d1a] text-sm outline-none transition focus:border-[#008560] focus:ring-2 focus:ring-[#008560]/20"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium tracking-wide uppercase text-[#3d4943]">
                                E-mail
                            </label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="nome@exemplo.com"
                                required
                                className="w-full px-3 sm:px-4 py-3 rounded-lg border border-[#bccac1] text-[#171d1a] text-sm outline-none transition focus:border-[#008560] focus:ring-2 focus:ring-[#008560]/20"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-medium tracking-wide uppercase text-[#3d4943]">
                                Senha
                            </label>

                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-3 sm:px-4 py-3 rounded-lg border border-[#bccac1] text-[#171d1a] text-sm outline-none transition focus:border-[#008560] focus:ring-2 focus:ring-[#008560]/20"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg bg-[#008560] text-white font-bold transition hover:bg-[#00694c] disabled:opacity-50"
                        >
                            {loading ? 'Cadastrando...' : 'Cadastrar'}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <footer className="text-center">
                    <p className="text-sm text-[#3d4943]">
                        Já tem conta?{" "}
                        <a href="/login" className="font-bold text-[#00694c] hover:underline">
                            Entrar
                        </a>
                    </p>
                </footer>

            </main>
        </div>
    )
}