import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import { API_URL } from '../config/api'

interface Farm {
    id: string
    name: string
    userId: string
}

interface Sensor {
    id: string
    type: string
    status: string
    farmId: string
    lastSeen: string | null
}

interface FarmWithStats extends Farm {
    sensors: Sensor[]
    alertCount: number
}

export default function Farms() {
    const { token } = useAuth()
    const navigate = useNavigate()
    const [farms, setFarms] = useState<FarmWithStats[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [newFarmName, setNewFarmName] = useState('')
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        fetchFarms()
    }, [])

    const fetchFarms = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch(`${API_URL}/farms`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)

            const farmsList: Farm[] = data.data ?? data

            const farmsWithStats = await Promise.all(
                farmsList.map(async (farm) => {
                    const sensorsRes = await fetch(`${API_URL}/farms/${farm.id}/sensors`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    const sensorsData = await sensorsRes.json()

                    const alertsRes = await fetch(`${API_URL}/alerts`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    const alertsData = await alertsRes.json()

                    return {
                        ...farm,
                        sensors: sensorsData.data ?? sensorsData ?? [],
                        alertCount: (alertsData.data ?? alertsData ?? []).length,
                    }
                })
            )

            setFarms(farmsWithStats)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar lavouras')
        } finally {
            setLoading(false)
        }
    }

    const handleCreateFarm = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newFarmName.trim()) return
        setCreating(true)
        try {
            const res = await fetch(`${API_URL}/farms`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: newFarmName.trim() }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Erro ao criar lavoura')
            setNewFarmName('')
            setShowModal(false)
            fetchFarms()
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Erro ao criar lavoura')
        } finally {
            setCreating(false)
        }
    }

    const farmStatus = (farm: FarmWithStats) => {
        const inactive = farm.sensors.filter(s => s.status === 'inativo').length
        if (inactive >= 2) return { label: 'CRÍTICO', color: 'text-[#ba1a1a] bg-[#ba1a1a]/10 border-[#ba1a1a]/20' }
        if (inactive === 1) return { label: 'ALERTA', color: 'text-[#855000] bg-[#855000]/10 border-[#855000]/20' }
        return { label: 'NORMAL', color: 'text-[#00694c] bg-[#00694c]/10 border-[#00694c]/20' }
    }

    const totalSensors = farms.reduce((acc, f) => acc + f.sensors.length, 0)
    const activeSensors = farms.reduce((acc, f) => acc + f.sensors.filter(s => s.status === 'ativo').length, 0)
    const totalAlerts = farms.length > 0 ? farms[0].alertCount : 0

    return (
        <Layout
            headerExtra={
                <input
                    type="text"
                    placeholder="Buscar lavoura..."
                    className="w-full max-w-xs px-4 py-1.5 text-sm rounded-lg border border-[#bccac1] bg-white outline-none focus:ring-2 focus:ring-[#00694c]"
                />
            }
        >
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-medium text-[#171d1a]">Minhas Lavouras</h1>
                    <p className="text-sm text-[#3d4943]">Gerencie o monitoramento de suas áreas de cultivo.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center justify-center gap-2 bg-[#00694c] hover:bg-[#008560] text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-md"
                >
                    <span>+</span>
                    Nova Lavoura
                </button>
            </div>

            {error && (
                <div className="p-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200 flex justify-between items-center">
                    <span>{error}</span>
                    <button onClick={fetchFarms} className="font-bold hover:underline ml-4">Tentar novamente</button>
                </div>
            )}

            {/* Stats Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#bccac1]/30 flex items-center gap-4">
                    <div className="p-2 bg-[#008560]/10 text-[#008560] rounded-lg text-xl">🌿</div>
                    <div>
                        <p className="text-[11px] text-[#3d4943] uppercase font-medium">Total de Áreas</p>
                        <p className="text-xl font-medium">{farms.length} Lavouras</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#bccac1]/30 flex items-center gap-4">
                    <div className="p-2 bg-[#fd7549]/10 text-[#a8380f] rounded-lg text-xl">📡</div>
                    <div>
                        <p className="text-[11px] text-[#3d4943] uppercase font-medium">Sensores Ativos</p>
                        <p className="text-xl font-medium">{activeSensors}/{totalSensors} Unidades</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#bccac1]/30 flex items-center gap-4">
                    <div className="p-2 bg-[#ba1a1a]/10 text-[#ba1a1a] rounded-lg text-xl">⚠️</div>
                    <div>
                        <p className="text-[11px] text-[#3d4943] uppercase font-medium">Alertas Ativos</p>
                        <p className="text-xl font-medium">{totalAlerts} Registrados</p>
                    </div>
                </div>
            </div>

            {/* Farm Grid */}
            {loading ? (
                <div className="flex items-center justify-center py-16 text-[#3d4943]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[#008560] border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Carregando lavouras...</span>
                    </div>
                </div>
            ) : farms.length === 0 ? (
                <div className="p-12 flex flex-col items-center justify-center text-center opacity-60 border-2 border-dashed border-[#bccac1] rounded-2xl">
                    <span className="text-5xl mb-4">🏞️</span>
                    <p className="text-lg font-bold">Nenhuma lavoura cadastrada</p>
                    <p className="text-sm max-w-sm text-[#3d4943]">Comece adicionando sua primeira área de cultivo ao sistema.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {farms.map(farm => {
                        const status = farmStatus(farm)
                        const activeCount = farm.sensors.filter(s => s.status === 'ativo').length
                        return (
                            <div key={farm.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#bccac1] hover:shadow-md transition-shadow">
                                <div className="h-20 sm:h-24 w-full bg-gradient-to-br from-[#00694c] to-[#008560] relative flex items-end p-4">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full text-[10px]">
                                        📍 ID: {farm.id.slice(0, 8)}
                                    </span>
                                </div>
                                <div className="p-4 sm:p-6 flex flex-col gap-4">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <h3 className="text-lg sm:text-xl font-medium text-[#171d1a]">{farm.name}</h3>
                                            <div className="flex items-center gap-1 text-[#3d4943] mt-1">
                                                <span className="text-sm">📡</span>
                                                <span className="text-sm">{activeCount} sensores ativos</span>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 text-[11px] font-bold rounded-full border whitespace-nowrap ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </div>
                                    {farm.sensors.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {farm.sensors.slice(0, 4).map(sensor => (
                                                <div
                                                    key={sensor.id}
                                                    className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-bold ${sensor.status === 'ativo' ? 'bg-[#eaefea] border-[#bccac1]/30 text-[#171d1a]' : 'bg-red-50 border-red-200 text-red-700'}`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${sensor.status === 'ativo' ? 'bg-[#00694c]' : 'bg-red-600'}`} />
                                                    {sensor.type}
                                                </div>
                                            ))}
                                            {farm.sensors.length > 4 && (
                                                <div className="flex items-center px-2 py-1 text-xs text-[#6d7a73]">+{farm.sensors.length - 4}</div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-[#6d7a73]">Nenhum sensor cadastrado ainda.</p>
                                    )}
                                    <div className="pt-3 border-t border-[#bccac1]/30 flex justify-end">
                                        <button onClick={() => navigate(`/farms/${farm.id}`)} className="flex items-center gap-1 text-[#00694c] font-bold text-sm hover:underline">
                                            Ver detalhes →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {farms.length > 0 && (
                <div
                    onClick={() => setShowModal(true)}
                    className="p-6 sm:p-8 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity border-2 border-dashed border-[#bccac1] rounded-2xl cursor-pointer"
                >
                    <span className="text-4xl mb-2">🏞️</span>
                    <p className="text-base font-bold">Deseja adicionar mais áreas?</p>
                    <p className="text-sm max-w-sm text-[#3d4943]">Expanda sua capacidade de monitoramento.</p>
                </div>
            )}

            {/* Modal - Nova Lavoura */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
                        <h3 className="text-lg font-bold mb-4 text-[#171d1a]">Nova Lavoura</h3>
                        <form onSubmit={handleCreateFarm} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-medium uppercase text-[#3d4943]">Nome da lavoura</label>
                                <input
                                    type="text"
                                    value={newFarmName}
                                    onChange={e => setNewFarmName(e.target.value)}
                                    placeholder="Ex: Lavoura A - Soja"
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