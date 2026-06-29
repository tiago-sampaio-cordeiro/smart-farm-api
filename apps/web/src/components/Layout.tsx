import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
    { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { label: 'Lavouras', icon: '🌿', path: '/farms' },
    { label: 'Sensores', icon: '📡', path: '/sensors' },
    { label: 'Medições', icon: '📈', path: '/measurements' },
    { label: 'Alertas', icon: '🔔', path: '/alerts' },
    { label: 'Parâmetros', icon: '⚙️', path: '/thresholds' },
]

interface LayoutProps {
    children: ReactNode
    headerExtra?: ReactNode
}

export default function Layout({ children, headerExtra }: LayoutProps) {
    const { logout } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div style={{ fontFamily: 'Manrope, sans-serif' }} className="bg-[#f5fbf5] text-[#171d1a] min-h-screen flex">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed h-full w-[220px] sm:w-[200px] left-0 top-0 bg-white flex flex-col
        py-8 px-4 justify-between z-50 shadow-[1px_0_0_#bccac1]
        transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
                <div>
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <div className="text-xl font-black text-[#00694c]">Smart Farm</div>
                            <div className="text-xs text-[#3d4943]">Precision IoT</div>
                        </div>
                        <button className="lg:hidden text-2xl leading-none" onClick={() => setSidebarOpen(false)}>✕</button>
                    </div>
                    <nav className="flex flex-col gap-1">
                        {navItems.map(item => (
                            <NavLink
                                key={item.label}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium no-underline transition
                  ${isActive ? 'bg-[#008560] text-white' : 'text-[#3d4943] hover:bg-[#eaefea]'}`
                                }
                            >
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                </div>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-2 rounded-lg border-none bg-transparent text-[#3d4943] text-sm font-medium cursor-pointer w-full hover:bg-[#eaefea]"
                >
                    <span>🚪</span>
                    <span>Sair</span>
                </button>
            </aside>

            {/* Header */}
            <header className="
        fixed top-0 right-0 left-0 lg:left-[200px]
        flex justify-between items-center h-16 px-4 sm:px-8
        bg-[#f5fbf5] z-30 border-b border-[#bccac1]
      ">
                <button className="lg:hidden text-2xl leading-none" onClick={() => setSidebarOpen(true)}>☰</button>
                <div className="flex-1 flex items-center gap-2 sm:gap-4 ml-2 lg:ml-0 min-w-0">
                    {headerExtra}
                </div>
            </header>

            {/* Main */}
            <main className="lg:ml-[200px] mt-16 p-4 sm:p-6 lg:p-8 flex-1 flex flex-col gap-6 lg:gap-8 w-full">
                {children}
            </main>
        </div>
    )
}