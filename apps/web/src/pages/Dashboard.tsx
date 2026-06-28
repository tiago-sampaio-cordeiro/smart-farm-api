import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

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
    const { token, logout } = useAuth()
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
            const res = await fetch('http://localhost:3000/farms', {
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
        const res = await fetch('http://localhost:3000/alerts', {
            headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setAlerts(data.data?.slice(0, 3) || [])
    }

    const fetchSensors = async (farmId: string) => {
        const res = await fetch(`http://localhost:3000/farms/${farmId}/sensors`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        setSensors(data.data || [])
    }

    const activeSensors = sensors.filter(s => s.status === 'ativo').length
    const inactiveSensors = sensors.filter(s => s.status === 'inativo').length

    const severityColor = (severity: string) => {
        if (severity === 'CRITICO') return { bg: 'rgba(186,26,26,0.1)', dot: '#ba1a1a', badge: '#ba1a1a', badgeBg: 'rgba(186,26,26,0.1)' }
        if (severity === 'MODERADO') return { bg: 'rgba(253,117,73,0.1)', dot: '#fd7549', badge: '#661a00', badgeBg: 'rgba(253,117,73,0.1)' }
        return { bg: 'rgba(0,0,0,0.04)', dot: '#6d7a73', badge: '#3d4943', badgeBg: '#eaefea' }
    }

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 60) return `${mins}m atrás`
        return `${Math.floor(mins / 60)}h atrás`
    }

    return (
        <div style={{ fontFamily: 'Manrope, sans-serif', backgroundColor: '#f5fbf5', color: '#171d1a' }}>
            {/* Sidebar */}
            <aside style={{
                position: 'fixed', height: '100%', width: 200, left: 0, top: 0,
                backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column',
                padding: '32px 16px', justifyContent: 'space-between', zIndex: 50,
                boxShadow: '1px 0 0 #bccac1'
            }}>
                <div>
                    <div style={{ marginBottom: 32 }}>
                        <div style={{ fontSize: 20, fontWeight: 900, color: '#00694c' }}>Smart Farm</div>
                        <div style={{ fontSize: 12, color: '#3d4943' }}>Precision IoT</div>
                    </div>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {[
                            { label: 'Dashboard', icon: '📊', active: true },
                            { label: 'Lavouras', icon: '🌿', active: false },
                            { label: 'Sensores', icon: '📡', active: false },
                            { label: 'Medições', icon: '📈', active: false },
                            { label: 'Alertas', icon: '🔔', active: false },
                            { label: 'Parâmetros', icon: '⚙️', active: false },
                        ].map(item => (
                            <a key={item.label} href="#" style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '8px 16px', borderRadius: 8, textDecoration: 'none',
                                backgroundColor: item.active ? '#008560' : 'transparent',
                                color: item.active ? '#ffffff' : '#3d4943',
                                fontSize: 14, fontWeight: 500,
                            }}>
                                <span>{item.icon}</span>
                                <span>{item.label}</span>
                            </a>
                        ))}
                    </nav>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <button onClick={logout} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '8px 16px', borderRadius: 8, border: 'none',
                        backgroundColor: 'transparent', color: '#3d4943',
                        fontSize: 14, fontWeight: 500, cursor: 'pointer', width: '100%',
                    }}>
                        <span>🚪</span>
                        <span>Sair</span>
                    </button>
                </div>
            </aside>

            {/* Header */}
            <header style={{
                position: 'fixed', top: 0, right: 0, width: 'calc(100% - 200px)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                height: 64, padding: '0 32px', backgroundColor: '#f5fbf5', zIndex: 40,
                borderBottom: '1px solid #bccac1'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <select
                        value={selectedFarm?.id || ''}
                        onChange={e => setSelectedFarm(farms.find(f => f.id === e.target.value) || null)}
                        style={{
                            padding: '6px 12px', borderRadius: 8, border: '1px solid #bccac1',
                            backgroundColor: '#eaefea', fontSize: 14, fontWeight: 700, color: '#171d1a',
                            cursor: 'pointer',
                        }}
                    >
                        {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 10, height: 10, backgroundColor: '#00694c', borderRadius: '50%' }} />
                        <span style={{ fontSize: 12, color: '#3d4943' }}>Sistema ativo</span>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main style={{ marginLeft: 200, marginTop: 64, padding: 32 }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 48, color: '#3d4943' }}>Carregando...</div>
                ) : (
                    <>
                        {/* Metric Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 32 }}>
                            {[
                                { label: 'SENSORES ATIVOS', value: `${activeSensors}/${sensors.length}`, icon: '📡', sub: inactiveSensors > 0 ? `${inactiveSensors} inativo(s)` : 'Todos ativos' },
                                { label: 'ALERTAS TOTAIS', value: alerts.length.toString(), icon: '🔔', sub: 'Últimos registros' },
                                { label: 'LAVOURAS', value: farms.length.toString(), icon: '🌿', sub: 'Cadastradas' },
                                { label: 'STATUS', value: 'Online', icon: '✅', sub: 'Sistema operacional' },
                            ].map(card => (
                                <div key={card.label} style={{
                                    backgroundColor: '#ffffff', padding: 16, borderRadius: 12,
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid rgba(188,202,193,0.1)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <span style={{ fontSize: 11, color: '#3d4943', letterSpacing: '0.05em', fontWeight: 500 }}>{card.label}</span>
                                        <span style={{ fontSize: 20 }}>{card.icon}</span>
                                    </div>
                                    <div style={{ fontSize: 36, fontWeight: 500, color: '#171d1a', lineHeight: 1.1 }}>{card.value}</div>
                                    <div style={{ marginTop: 4, fontSize: 11, color: '#6d7a73' }}>{card.sub}</div>
                                </div>
                            ))}
                        </div>

                        {/* Alerts + Sensors */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
                            {/* Alerts */}
                            <div style={{ backgroundColor: '#ffffff', padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, color: '#171d1a' }}>Alertas recentes</h3>
                                {alerts.length === 0 ? (
                                    <p style={{ color: '#6d7a73', fontSize: 14 }}>Nenhum alerta registrado.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {alerts.map(alert => {
                                            const colors = severityColor(alert.severity)
                                            return (
                                                <div key={alert.id} style={{
                                                    display: 'flex', alignItems: 'flex-start', gap: 12,
                                                    padding: 12, borderRadius: 8, backgroundColor: colors.bg
                                                }}>
                                                    <div style={{ width: 8, height: 8, marginTop: 6, backgroundColor: colors.dot, borderRadius: '50%', flexShrink: 0 }} />
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                            <span style={{
                                                                fontSize: 11, fontWeight: 700, padding: '1px 8px',
                                                                backgroundColor: colors.badgeBg, color: colors.badge, borderRadius: 999
                                                            }}>{alert.severity}</span>
                                                            <span style={{ fontSize: 12, color: '#3d4943' }}>{timeAgo(alert.createdAt)}</span>
                                                        </div>
                                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#171d1a' }}>
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
                            <div style={{ backgroundColor: '#ffffff', padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                <h3 style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, color: '#171d1a' }}>Status dos sensores</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {sensors.length === 0 ? (
                                        <p style={{ color: '#6d7a73', fontSize: 14 }}>Nenhum sensor cadastrado.</p>
                                    ) : (
                                        sensors.map(sensor => (
                                            <div key={sensor.id} style={{
                                                display: 'flex', alignItems: 'center', gap: 8,
                                                padding: '6px 12px', borderRadius: 999,
                                                backgroundColor: sensor.status === 'ativo' ? '#f5fbf5' : 'rgba(186,26,26,0.1)',
                                                border: `1px solid ${sensor.status === 'ativo' ? '#bccac1' : 'rgba(186,26,26,0.2)'}`,
                                            }}>
                                                <div style={{
                                                    width: 8, height: 8, borderRadius: '50%',
                                                    backgroundColor: sensor.status === 'ativo' ? '#00694c' : '#ba1a1a'
                                                }} />
                                                <span style={{ fontSize: 12, fontWeight: 700, color: sensor.status === 'ativo' ? '#171d1a' : '#ba1a1a' }}>
                                                    {sensor.type}
                                                </span>
                                                <span style={{ fontSize: 12, color: '#6d7a73' }}>{sensor.status}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}