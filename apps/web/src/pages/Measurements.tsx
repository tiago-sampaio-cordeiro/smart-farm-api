import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'

interface Farm {
    id: string
    name: string
}

interface Sensor {
    id: string
    type: string
    status: string
    farmId: string
}

interface Measurement {
    id: string
    sensorId: string
    temperatura: number | null
    umidade: number | null
    luminosidade: number | null
    timestamp: string
}

export default function Measurements() {
    const { token } = useAuth()
    const [farms, setFarms] = useState<Farm[]>([])
    const [sensors, setSensors] = useState<Sensor[]>([])
    const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null)
    const [selectedSensorId, setSelectedSensorId] = useState<string>('')
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
    const [measurements, setMeasurements] = useState<Measurement[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchFarms()
    }, [])

    useEffect(() => {
        if (selectedFarm) fetchSensors(selectedFarm.id)
    }, [selectedFarm])

    useEffect(() => {
        fetchMeasurements()
    }, [selectedSensorId])

    const fetchFarms = async () => {
        try {
            const res = await fetch('http://localhost:3000/farms', {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            setFarms(data.data)
            if (data.data.length > 0) setSelectedFarm(data.data[0])
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    const fetchSensors = async (farmId: string) => {
        try {
            const res = await fetch(`http://localhost:3000/farms/${farmId}/sensors`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            setSensors(data.data || [])
            setSelectedSensorId('')
        } catch {
            setSensors([])
        }
    }

    const fetchMeasurements = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (selectedSensorId) params.set('sensorId', selectedSensorId)
            if (from) params.set('from', from)
            if (to) params.set('to', to)

            const res = await fetch(`http://localhost:3000/measurements?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            setMeasurements(data.data || [])
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault()
        fetchMeasurements()
    }

    const avg = (values: number[]) =>
        values.length ? (values.reduce((a, b) => a + b, 0) / values.length) : 0

    const temps = measurements.map(m => m.temperatura).filter((v): v is number => v !== null)
    const umids = measurements.map(m => m.umidade).filter((v): v is number => v !== null)
    const luxs = measurements.map(m => m.luminosidade).filter((v): v is number => v !== null)

    const sensorName = (sensorId: string) => sensors.find(s => s.id === sensorId)?.type || sensorId.slice(0, 8)

    const formatDate = (d: string) => new Date(d).toLocaleString('pt-BR')

    return (
        <Layout
            headerExtra={
                <select
                    value={selectedFarm?.id || ''}
                    onChange={e => setSelectedFarm(farms.find(f => f.id === e.target.value) || null)}
                    className="px-2 sm:px-3 py-1.5 rounded-lg border border-[#bccac1] bg-[#eaefea] text-xs sm:text-sm font-bold text-[#171d1a] cursor-pointer min-w-0 truncate"
                >
                    {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
            }
        >
            {/* Header & Filters */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-medium text-[#171d1a]">Medições</h1>
                    <p className="text-sm text-[#3d4943]">Dados históricos e em tempo real dos sensores instalados em campo.</p>
                </div>

                <form
                    onSubmit={handleFilter}
                    className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-[#bccac1]/20 flex flex-wrap items-end gap-3"
                >
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-[#3d4943] ml-1">Sensor</label>
                        <select
                            value={selectedSensorId}
                            onChange={e => setSelectedSensorId(e.target.value)}
                            className="bg-[#f5fbf5] border border-[#bccac1] rounded-lg text-sm min-w-[140px] px-3 py-2 outline-none focus:ring-2 focus:ring-[#00694c]"
                        >
                            <option value="">Todos</option>
                            {sensors.map(s => (
                                <option key={s.id} value={s.id}>{s.type} ({s.id.slice(0, 6)})</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-[#3d4943] ml-1">De</label>
                        <input
                            type="date"
                            value={from}
                            onChange={e => setFrom(e.target.value)}
                            className="bg-[#f5fbf5] border border-[#bccac1] rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-[#00694c]"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-[#3d4943] ml-1">Até</label>
                        <input
                            type="date"
                            value={to}
                            onChange={e => setTo(e.target.value)}
                            className="bg-[#f5fbf5] border border-[#bccac1] rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-[#00694c]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-[#00694c] text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#008560] transition-all flex items-center gap-2"
                    >
                        🔍 Filtrar
                    </button>
                </form>
            </div>

            {error && (
                <div className="p-3 rounded-lg text-sm text-red-700 bg-red-50 border border-red-200">{error}</div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-[#bccac1]/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[11px] text-[#3d4943] uppercase font-medium">Média Temperatura</p>
                            <h3 className="text-3xl sm:text-4xl font-medium text-[#00694c] leading-none mt-1">
                                {temps.length ? avg(temps).toFixed(1) : '—'}<span className="text-lg">°C</span>
                            </h3>
                        </div>
                        <div className="p-2 bg-[#00694c]/10 rounded-lg text-2xl">🌡️</div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-[#bccac1]/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[11px] text-[#3d4943] uppercase font-medium">Média Umidade</p>
                            <h3 className="text-3xl sm:text-4xl font-medium text-[#a8380f] leading-none mt-1">
                                {umids.length ? avg(umids).toFixed(0) : '—'}<span className="text-lg">%</span>
                            </h3>
                        </div>
                        <div className="p-2 bg-[#a8380f]/10 rounded-lg text-2xl">💧</div>
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-[#bccac1]/10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[11px] text-[#3d4943] uppercase font-medium">Luminosidade Média</p>
                            <h3 className="text-3xl sm:text-4xl font-medium text-[#855000] leading-none mt-1">
                                {luxs.length ? (avg(luxs) / 1000).toFixed(1) : '—'}<span className="text-lg">k lux</span>
                            </h3>
                        </div>
                        <div className="p-2 bg-[#855000]/10 rounded-lg text-2xl">☀️</div>
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-[#bccac1]/10 overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-[#bccac1]/20 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-[#171d1a]">Histórico de Coletas</h3>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-[#3d4943]">Carregando medições...</div>
                ) : measurements.length === 0 ? (
                    <div className="text-center py-12 text-[#3d4943] text-sm">Nenhuma medição encontrada para esses filtros.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[700px]">
                            <thead>
                                <tr className="bg-[#eaefea]">
                                    <th className="px-4 sm:px-6 py-3 text-xs font-medium text-[#3d4943] uppercase">Timestamp</th>
                                    <th className="px-4 sm:px-6 py-3 text-xs font-medium text-[#3d4943] uppercase">Sensor</th>
                                    <th className="px-4 sm:px-6 py-3 text-xs font-medium text-[#3d4943] uppercase">Temperatura</th>
                                    <th className="px-4 sm:px-6 py-3 text-xs font-medium text-[#3d4943] uppercase">Umidade</th>
                                    <th className="px-4 sm:px-6 py-3 text-xs font-medium text-[#3d4943] uppercase">Luminosidade</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#bccac1]/20">
                                {measurements.map(m => (
                                    <tr key={m.id} className="hover:bg-[#eaefea]/40 transition-colors">
                                        <td className="px-4 sm:px-6 py-3 text-sm text-[#171d1a]">{formatDate(m.timestamp)}</td>
                                        <td className="px-4 sm:px-6 py-3 text-sm font-bold text-[#171d1a]">{sensorName(m.sensorId)}</td>
                                        <td className="px-4 sm:px-6 py-3 text-sm text-[#171d1a]">{m.temperatura !== null ? `${m.temperatura} °C` : '—'}</td>
                                        <td className="px-4 sm:px-6 py-3 text-sm text-[#171d1a]">{m.umidade !== null ? `${m.umidade}%` : '—'}</td>
                                        <td className="px-4 sm:px-6 py-3 text-sm text-[#171d1a]">{m.luminosidade !== null ? `${m.luminosidade} lux` : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && measurements.length > 0 && (
                    <div className="px-4 sm:px-6 py-3 flex items-center justify-between bg-[#eaefea]/30">
                        <p className="text-xs text-[#3d4943]">Exibindo {measurements.length} registro(s)</p>
                    </div>
                )}
            </div>
        </Layout>
    )
}