import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import { API_URL } from '../config/api'

interface Farm {
    id: string
    name: string
}

interface Sensor {
    id: string
    type: string
    status: string
    farmId: string
    lastSeen: string | null
}

export default function Sensors() {
    const { token } = useAuth()
    const [farms, setFarms] = useState<Farm[]>([])
    const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null)
    const [sensors, setSensors] = useState<Sensor[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [newType, setNewType] = useState('')
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        fetchFarms()
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
            if (!res.ok) throw new Error(data.message)
            setFarms(data.data)
            if (data.data.length > 0) setSelectedFarm(data.data[0])
            else setLoading(false)
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    const fetchSensors = async (farmId: string) => {
        setLoading(true)
        try {
            const res = await fetch(`${API_URL}/farms/${farmId}/sensors`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            setSensors(data.data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateSensor = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedFarm) return
        setCreating(true)
        try {
            const res = await fetch(`${API_URL}/farms/${selectedFarm.id}/sensors`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ type: newType }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Erro ao criar sensor')
            setNewType('')
            setShowModal(false)
            fetchSensors(selectedFarm.id)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setCreating(false)
        }
    }

    const activeCount = sensors.filter(s => s.status === 'ativo').length
    const lastSeenLabel = (lastSeen: string | null) => {
        if (!lastSeen) return 'Nunca'
        const diff = Date.now() - new Date(lastSeen).getTime()
        const mins = Math.floor(diff / 60000)
        if (mins < 1) return 'agora'
        if (mins < 60) return `há ${mins}min`
        return `há ${Math.floor(mins / 60)}h`
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
                </>
            }
        >
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-medium text-[#171d1a]">Sensores</h1>
                    <p className="text-sm text-[#3d4943]">Gerenciamento e monitoramento em tempo real de hardware IoT.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    disabled={!selectedFarm}
                    className="flex items-center justify-center gap-2 bg-[#00694c] hover:bg-[#008560] disabled:opacity-50 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md"
                >
                    <span>+</span>
                    Novo Sensor
                </button>
            </div>

            {error && (
                <div className="p-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">{error}</div>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex flex-col justify-between min-h-[120px]">
                    <span className="text-[11px] text-[#3d4943] uppercase tracking-widest font-medium">Sensores Ativos</span>
                    <div className="text-3xl sm:text-4xl font-medium text-[#00694c] mt-2">{activeCount} / {sensors.length}</div>
                    <div className="flex items-center gap-1 text-xs text-[#3d4943] mt-2">
                        ✅ {sensors.length > 0 ? Math.round((activeCount / sensors.length) * 100) : 0}% de disponibilidade
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex flex-col justify-center">
                    <h3 className="text-lg font-medium text-[#171d1a]">Lavoura selecionada</h3>
                    <p className="text-sm text-[#3d4943] mt-1">{selectedFarm?.name || '—'}</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-[#bccac1] flex items-center justify-between">
                    <h2 className="text-lg font-medium text-[#171d1a]">Lista de Sensores</h2>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-[#3d4943]">Carregando sensores...</div>
                ) : sensors.length === 0 ? (
                    <div className="text-center py-12 text-[#3d4943] text-sm">Nenhum sensor cadastrado nesta lavoura.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px]">
                            <thead>
                                <tr className="bg-[#eaefea]">
                                    <th className="px-4 sm:px-6 py-3 text-xs font-medium text-[#3d4943]">ID</th>
                                    <th className="px-4 sm:px-6 py-3 text-xs font-medium text-[#3d4943]">Tipo</th>
                                    <th className="px-4 sm:px-6 py-3 text-xs font-medium text-[#3d4943]">Status</th>
                                    <th className="px-4 sm:px-6 py-3 text-xs font-medium text-[#3d4943]">Última leitura</th>
                                    <th className="px-4 sm:px-6 py-3 text-xs font-medium text-[#3d4943]">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#bccac1]/30">
                                {sensors.map(sensor => (
                                    <tr key={sensor.id} className={`hover:bg-[#eaefea]/50 transition-colors ${sensor.status !== 'ativo' ? 'bg-[#eaefea]/20' : ''}`}>
                                        <td className="px-4 sm:px-6 py-3 text-sm font-bold text-[#171d1a]">{sensor.id.slice(0, 8)}</td>
                                        <td className="px-4 sm:px-6 py-3 text-sm text-[#171d1a]">{sensor.type}</td>
                                        <td className="px-4 sm:px-6 py-3">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider
                        ${sensor.status === 'ativo' ? 'bg-[#00694c]/10 text-[#00694c]' : 'bg-red-100 text-red-700'}`}>
                                                {sensor.status}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 text-sm text-[#3d4943]">
                                            {sensor.status === 'ativo'
                                                ? lastSeenLabel(sensor.lastSeen)
                                                : <span className="text-red-700 flex items-center gap-1">⚠️ Sem dados {lastSeenLabel(sensor.lastSeen)}</span>
                                            }
                                        </td>
                                        <td className="px-4 sm:px-6 py-3">
                                            <button className="text-[#00694c] text-sm font-bold hover:underline">Ver medições</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal - Novo Sensor */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
                        <h3 className="text-lg font-bold mb-4 text-[#171d1a]">Novo Sensor</h3>
                        <form onSubmit={handleCreateSensor} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium uppercase text-[#3d4943]">Tipo do sensor</label>
                                <input
                                    type="text"
                                    value={newType}
                                    onChange={e => setNewType(e.target.value)}
                                    placeholder="Ex: temperatura, umidade, luminosidade"
                                    required
                                    className="w-full px-4 py-2.5 border rounded-lg text-sm outline-none border-[#bccac1] focus:ring-2 focus:ring-[#00694c]"
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm font-medium border border-[#bccac1] text-[#3d4943]">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={creating} className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#00694c] disabled:opacity-50">
                                    {creating ? 'Criando...' : 'Criar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    )
}