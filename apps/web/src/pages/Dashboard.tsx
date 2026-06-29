import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import { API_URL } from '../config/api'

interface Farm {
    id: string
    name: string
    userId: string
}

interface Alert {
    id: string
    type: string
    severity: string
    measurementId: string | null
    sensorId: string | null
    createdAt: string
}

interface Sensor {
    id: string
    type: string
    status: string
    farmId: string
    lastSeen: string | null
}

export default function Dashboard() {
    const { token } = useAuth()
    const [farms, setFarms] = useState<Farm[]>([])
    const [alerts, setAlerts] = useState<Alert[]>([])
    const [sensors, setSensors] = useState<Sensor[]>([])
    const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFarms()
        fetchAlerts()
    }, [])

    useEffect(() => {
        if (selectedFarm) fetchSensors(selectedFarm.id)
    }, [selectedFarm])

    const fetchFarms = async () => {
        try {
            const res = await fetch(`${API_URL}/farms`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            setFarms(data.data)
            if (data.data.length > 0) setSelectedFarm(data.data[0])
        } finally {
            setLoading(false)
        }
    }

    const fetchAlerts = async () => {
        const res = await fetch(`${API_URL}/alerts`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setAlerts(data.data?.slice(0, 3) || [])
    }

    const fetchSensors = async (farmId: string) => {
        const res = await fetch(`${API_URL}/farms/${farmId}/sensors`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setSensors(data.data || [])
    }

    const activeSensors = sensors.filter(s => s.status === 'ativo').length
    const inactiveSensors = sensors.filter(s => s.status === 'inativo').length

    const severityClasses = (severity: string) => {
        if (severity === 'CRITICO') return { bg: 'bg-red-50', dot: 'bg-red-700', badge: 'text-red-700 bg-red-100' }
        if (severity === 'MODERADO') return { bg: 'bg-orange-50', dot: 'bg-orange-500', badge: 'text-orange-800 bg-orange-100' }
        return { bg: 'bg-gray-50', dot: 'bg-gray-400', badge: 'text-gray-600 bg-gray-100' }
    }

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 60) return `${mins}m atrás`
        return `${Math.floor(mins / 60)}h atrás`
    }

    return (
        <Layout
            headerExtra={
                <>
                    <select
                        value={selectedFarm?.id || ''}
                        onChange={e => setSelectedFarm(farms.find(f => f.id === e.target.value) || null)}
                        className="px-2 sm:px-3 py-1.5 rounded-lg border border-[#bccac1] bg-[#eaefea] text-xs sm:text-sm font-bold text-[#171d1a] cursor-pointer min-w-0 truncate"
                    >
                        {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                    <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                        <div className="w-2.5 h-2.5 bg-[#00694c] rounded-full" />
                        <span className="text-xs text-[#3d4943] whitespace-nowrap">Sistema ativo</span>
                    </div>
                </>
            }
        >
            {loading ? (
                <div className="text-center py-12 text-[#3d4943]">Carregando...</div>
            ) : (
                <>
                    {/* Metric Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                        {[
                            { label: 'SENSORES ATIVOS', value: `${activeSensors}/${sensors.length}`, icon: '📡', sub: inactiveSensors > 0 ? `${inactiveSensors} inativo(s)` : 'Todos ativos' },
                            { label: 'ALERTAS TOTAIS', value: alerts.length.toString(), icon: '🔔', sub: 'Últimos registros' },
                            { label: 'LAVOURAS', value: farms.length.toString(), icon: '🌿', sub: 'Cadastradas' },
                            { label: 'STATUS', value: 'Online', icon: '✅', sub: 'Sistema operacional' },
                        ].map(card => (
                            <div key={card.label} className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-[#bccac1]/10">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] sm:text-[11px] text-[#3d4943] tracking-wide font-medium">{card.label}</span>
                                    <span className="text-lg sm:text-xl">{card.icon}</span>
                                </div>
                                <div className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#171d1a] leading-tight">{card.value}</div>
                                <div className="mt-1 text-[10px] sm:text-[11px] text-[#6d7a73]">{card.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Alerts + Sensors */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Alerts */}
                        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6 text-[#171d1a]">Alertas recentes</h3>
                            {alerts.length === 0 ? (
                                <p className="text-[#6d7a73] text-sm">Nenhum alerta registrado.</p>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {alerts.map(alert => {
                                        const c = severityClasses(alert.severity)
                                        return (
                                            <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg ${c.bg}`}>
                                                <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${c.badge}`}>{alert.severity}</span>
                                                        <span className="text-xs text-[#3d4943]">{timeAgo(alert.createdAt)}</span>
                                                    </div>
                                                    <div className="text-sm font-bold text-[#171d1a]">
                                                        {alert.type === 'threshold_exceeded' ? 'Limite ultrapassado' : 'Sensor offline'}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Sensors */}
                        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
                            <h3 className="text-base sm:text-lg font-medium mb-4 sm:mb-6 text-[#171d1a]">Status dos sensores</h3>
                            <div className="flex flex-wrap gap-2">
                                {sensors.length === 0 ? (
                                    <p className="text-[#6d7a73] text-sm">Nenhum sensor cadastrado.</p>
                                ) : (
                                    sensors.map(sensor => (
                                        <div
                                            key={sensor.id}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border
                        ${sensor.status === 'ativo' ? 'bg-[#f5fbf5] border-[#bccac1]' : 'bg-red-50 border-red-200'}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${sensor.status === 'ativo' ? 'bg-[#00694c]' : 'bg-red-700'}`} />
                                            <span className={`text-xs font-bold ${sensor.status === 'ativo' ? 'text-[#171d1a]' : 'text-red-700'}`}>
                                                {sensor.type}
                                            </span>
                                            <span className="text-xs text-[#6d7a73]">{sensor.status}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Layout>
    )
}