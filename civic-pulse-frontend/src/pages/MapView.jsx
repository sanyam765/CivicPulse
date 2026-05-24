import React, { useState, useEffect } from 'react'
import TopBar from '../components/shared/TopBar'
import { getAllComplaints } from '../services/complaintService'

const normalizeStatus = (status = '') => {
    const clean = status.toLowerCase().trim()
    if (clean === 'pending') return 'urgent'
    if (clean === 'in progress') return 'in-progress'
    if (clean === 'resolved') return 'resolved'
    return 'pending'
}

const complaintToPin = (complaint, index) => {
    const hasLocation = Number.isFinite(complaint.location?.latitude) && Number.isFinite(complaint.location?.longitude)
    const x = hasLocation ? ((complaint.location.longitude + 180) / 360) * 100 : 10 + (index * 13) % 80
    const y = hasLocation ? ((90 - complaint.location.latitude) / 180) * 100 : 12 + (index * 9) % 76

    return {
        id: complaint.complaintId || complaint._id,
        x: Math.min(95, Math.max(5, x)),
        y: Math.min(95, Math.max(5, y)),
        type: complaint.complaintType || 'other',
        title: complaint.description?.slice(0, 60) || 'Complaint reported',
        status: normalizeStatus(complaint.status),
        reports: 1,
    }
}

const statusColors = {
    urgent: { bg: '#ef4444', glow: 'rgba(239,68,68,0.4)', ring: 'rgba(239,68,68,0.3)' },
    pending: { bg: '#f59e0b', glow: 'rgba(245,158,11,0.4)', ring: 'rgba(245,158,11,0.3)' },
    'in-progress': { bg: '#3b82f6', glow: 'rgba(59,130,246,0.4)', ring: 'rgba(59,130,246,0.3)' },
    resolved: { bg: '#10b981', glow: 'rgba(16,185,129,0.4)', ring: 'rgba(16,185,129,0.3)' },
}

const typeIcons = {
    pothole: '🕳️',
    streetlight: '💡',
    garbage: '🗑️',
    water: '💧',
    drainage: '🌊',
    road: '🛣️',
}

function MapPin({ pin, isSelected, onClick }) {
    const colors = statusColors[pin.status]

    return (
        <div
            className="absolute cursor-pointer group z-10"
            style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -50%)' }}
            onClick={() => onClick(pin)}
        >

            <div
                className="absolute w-6 h-2 rounded-full bg-black/10 top-8 left-1/2 -translate-x-1/2 map-pin-shadow"
                style={{ animationDelay: `${pin.id * 200}ms` }}
            />

            <div
                className={`relative map-pin ${isSelected ? 'scale-150' : 'group-hover:scale-125'} transition-transform duration-300`}
                style={{ animationDelay: `${pin.id * 200}ms` }}
            >

                <div
                    className="w-5 h-5 rounded-full border-[2.5px] border-white shadow-xl flex items-center justify-center"
                    style={{
                        backgroundColor: colors.bg,
                        boxShadow: `0 0 12px ${colors.glow}, 0 4px 12px rgba(0,0,0,0.15)`,
                    }}
                >
                    {isSelected && (
                        <div className="text-[8px]">{typeIcons[pin.type]}</div>
                    )}
                </div>

                {pin.status === 'urgent' && (
                    <>
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                border: `2px solid ${colors.ring}`,
                                animation: 'pulse-ring 2s ease-out infinite',
                            }}
                        />
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{
                                border: `2px solid ${colors.ring}`,
                                animation: 'pulse-ring 2s ease-out 1s infinite',
                            }}
                        />
                    </>
                )}
            </div>

            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 glass-strong rounded-xl shadow-elevated p-3 min-w-[200px] transition-all duration-300 pointer-events-none ${isSelected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                }`}>
                <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm">{typeIcons[pin.type]}</span>
                    <span className="text-xs font-bold text-slate-700">{pin.title}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                    <span className="font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${colors.bg}20`, color: colors.bg }}>
                        {pin.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className="text-slate-400 font-medium">{pin.reports} reports</span>
                </div>

                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-white/90 -mt-1" />
            </div>
        </div>
    )
}

function HeatmapOverlay({ pins }) {
    const zones = pins.slice(0, 6).map((pin, index) => ({
        x: pin.x,
        y: pin.y,
        size: 80 + index * 12,
        intensity: pin.status === 'urgent' ? 0.2 : 0.12,
    }))
    return (
        <>
            {zones.map((zone, i) => (
                <div
                    key={i}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        left: `${zone.x}%`,
                        top: `${zone.y}%`,
                        width: `${zone.size}px`,
                        height: `${zone.size}px`,
                        transform: 'translate(-50%, -50%)',
                        background: `radial-gradient(circle, rgba(239,68,68,${zone.intensity}) 0%, rgba(245,158,11,${zone.intensity * 0.5}) 40%, transparent 70%)`,
                        animation: `float-gentle ${5 + i}s ease-in-out infinite`,
                        animationDelay: `${i * 1.5}s`,
                    }}
                />
            ))}
        </>
    )
}

export default function MapView() {
    const [selectedPin, setSelectedPin] = useState(null)
    const [showDetails, setShowDetails] = useState(false)
    const [statusFilter, setStatusFilter] = useState('all')
    const [showHeatmap, setShowHeatmap] = useState(false)
    const [mapPins, setMapPins] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchMapPins = async () => {
            try {
                const response = await getAllComplaints()
                const complaints = response?.data?.complaints || []
                setMapPins(complaints.map(complaintToPin))
                setError('')
            } catch (err) {
                setError(err.message || 'Failed to load map complaints')
            } finally {
                setLoading(false)
            }
        }

        fetchMapPins()
        const interval = setInterval(fetchMapPins, 15000)
        return () => clearInterval(interval)
    }, [])

    const filteredPins = mapPins.filter(p => statusFilter === 'all' || p.status === statusFilter)

    const statusCounts = {
        all: mapPins.length,
        urgent: mapPins.filter(p => p.status === 'urgent').length,
        pending: mapPins.filter(p => p.status === 'pending').length,
        'in-progress': mapPins.filter(p => p.status === 'in-progress').length,
        resolved: mapPins.filter(p => p.status === 'resolved').length,
    }

    return (
        <div className="animate-fade-in">
            <TopBar
                title="Map View"
                subtitle="Live complaint map refreshed every 15 seconds"
            />
            {loading && (
                <div className="mb-4 glass rounded-2xl p-3 text-sm text-slate-500">
                    Loading live map data...
                </div>
            )}
            {error && !loading && (
                <div className="mb-4 glass rounded-2xl p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">

                <div className="xl:col-span-3 glass rounded-2xl shadow-float overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>

                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/20">
                        <div className="flex items-center gap-2">
                            {Object.entries(statusCounts).map(([key, count]) => (
                                <button
                                    key={key}
                                    onClick={() => setStatusFilter(key)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${statusFilter === key
                                            ? 'bg-emerald-500 text-white shadow-sm'
                                            : 'text-slate-500 hover:bg-white/50'
                                        }`}
                                >
                                    {key !== 'all' && (
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[key]?.bg || '#10b981' }} />
                                    )}
                                    <span className="capitalize">{key === 'all' ? 'All' : key.replace('-', ' ')}</span>
                                    <span className={`text-[10px] font-bold ${statusFilter === key ? 'text-white/70' : 'text-slate-400'}`}>
                                        {count}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowHeatmap(!showHeatmap)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${showHeatmap ? 'bg-red-50 text-red-600' : 'text-slate-500 hover:bg-white/50'
                                    }`}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="12" r="6" />
                                    <circle cx="12" cy="12" r="2" />
                                </svg>
                                Heatmap
                            </button>
                        </div>
                    </div>

                    <div className="relative w-full h-full bg-gradient-to-br from-emerald-50/60 to-teal-50/60">

                        <div className="absolute inset-0 opacity-[0.06]"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)',
                                backgroundSize: '40px 40px',
                            }}
                        />

                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">

                            <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(148,163,184,0.15)" strokeWidth="0.8" />
                            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(148,163,184,0.15)" strokeWidth="0.8" />
                            <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(148,163,184,0.15)" strokeWidth="0.8" />
                            <line x1="25" y1="0" x2="25" y2="100" stroke="rgba(148,163,184,0.15)" strokeWidth="0.8" />
                            <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(148,163,184,0.15)" strokeWidth="0.8" />
                            <line x1="75" y1="0" x2="75" y2="100" stroke="rgba(148,163,184,0.15)" strokeWidth="0.8" />

                            <path d="M10 10 Q40 30 80 20" stroke="rgba(148,163,184,0.1)" strokeWidth="0.5" fill="none" />
                            <path d="M20 80 Q50 60 90 85" stroke="rgba(148,163,184,0.1)" strokeWidth="0.5" fill="none" />
                            <path d="M5 50 Q30 40 60 55 Q80 60 95 45" stroke="rgba(148,163,184,0.1)" strokeWidth="0.5" fill="none" />
                        </svg>

                        <div className="absolute rounded-lg border border-slate-200/20 bg-slate-100/10" style={{ left: '5%', top: '5%', width: '25%', height: '20%' }}>
                            <span className="absolute top-2 left-3 text-[9px] font-bold text-slate-300 uppercase tracking-widest">Ward 1 • Downtown</span>
                        </div>
                        <div className="absolute rounded-lg border border-slate-200/20 bg-slate-100/10" style={{ left: '35%', top: '5%', width: '30%', height: '25%' }}>
                            <span className="absolute top-2 left-3 text-[9px] font-bold text-slate-300 uppercase tracking-widest">Ward 2 • Midtown</span>
                        </div>
                        <div className="absolute rounded-lg border border-slate-200/20 bg-slate-100/10" style={{ left: '70%', top: '10%', width: '25%', height: '30%' }}>
                            <span className="absolute top-2 left-3 text-[9px] font-bold text-slate-300 uppercase tracking-widest">Ward 3 • East End</span>
                        </div>
                        <div className="absolute rounded-lg border border-slate-200/20 bg-slate-100/10" style={{ left: '10%', top: '40%', width: '35%', height: '25%' }}>
                            <span className="absolute top-2 left-3 text-[9px] font-bold text-slate-300 uppercase tracking-widest">Ward 4 • Central</span>
                        </div>
                        <div className="absolute rounded-lg border border-slate-200/20 bg-slate-100/10" style={{ left: '50%', top: '55%', width: '40%', height: '30%' }}>
                            <span className="absolute top-2 left-3 text-[9px] font-bold text-slate-300 uppercase tracking-widest">Ward 5 • South</span>
                        </div>
                        <div className="absolute rounded-lg border border-slate-200/20 bg-slate-100/10" style={{ left: '5%', top: '70%', width: '30%', height: '25%' }}>
                            <span className="absolute top-2 left-3 text-[9px] font-bold text-slate-300 uppercase tracking-widest">Ward 6 • Riverside</span>
                        </div>

                        {showHeatmap && <HeatmapOverlay pins={filteredPins} />}

                        {filteredPins.map((pin) => (
                            <MapPin
                                key={pin.id}
                                pin={pin}
                                isSelected={selectedPin?.id === pin.id}
                                onClick={setSelectedPin}
                            />
                        ))}
                    </div>
                </div>

                <div className="space-y-5">

                    <div className="glass rounded-2xl shadow-float p-5">
                        <h3 className="font-display text-base font-bold text-slate-800 mb-4">Overview</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Total Reports', value: mapPins.length, color: '#10b981' },
                                { label: 'Hotspot Zones', value: Math.min(6, Math.max(1, Math.ceil(filteredPins.length / 4))), color: '#ef4444' },
                                { label: 'Active Crews', value: Math.max(1, Math.ceil(statusCounts['in-progress'] / 3)), color: '#3b82f6' },
                                { label: 'Avg Response', value: 'live', color: '#f59e0b' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/40 group hover:bg-white/60 transition-all">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                                        <span className="text-xs font-semibold text-slate-500">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-bold text-slate-700">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedPin && (
                        <div className="glass rounded-2xl shadow-float p-5 animate-scale-in">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl">{typeIcons[selectedPin.type]}</span>
                                <h3 className="font-display text-base font-bold text-slate-800">{selectedPin.title}</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-medium">Status</span>
                                    <span
                                        className="font-bold px-2 py-0.5 rounded-full capitalize"
                                        style={{
                                            backgroundColor: `${statusColors[selectedPin.status].bg}15`,
                                            color: statusColors[selectedPin.status].bg,
                                        }}
                                    >
                                        {selectedPin.status.replace('-', ' ')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-medium">Reports</span>
                                    <span className="font-bold text-slate-700">{selectedPin.reports}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-medium">Location</span>
                                    <span className="font-bold text-slate-700">{selectedPin.x}°N, {selectedPin.y}°E</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowDetails(true)}
                                className="w-full mt-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all hover:-translate-y-0.5"
                            >
                                View Full Details
                            </button>
                        </div>
                    )}

                    <div className="glass rounded-2xl shadow-float p-5">
                        <h3 className="font-display text-base font-bold text-slate-800 mb-4">Legend</h3>
                        <div className="space-y-2.5">
                            {Object.entries(statusColors).map(([key, colors]) => (
                                <div key={key} className="flex items-center gap-3 group">
                                    <div className="relative">
                                        <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: colors.bg }} />
                                        {key === 'urgent' && (
                                            <div className="absolute inset-0 rounded-full" style={{ border: `2px solid ${colors.ring}`, animation: 'pulse-ring 2s ease-out infinite' }} />
                                        )}
                                    </div>
                                    <span className="text-xs font-semibold text-slate-600 capitalize">{key.replace('-', ' ')}</span>
                                    <span className="ml-auto text-xs font-bold text-slate-400">{statusCounts[key]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {showDetails && selectedPin && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="glass rounded-3xl shadow-2xl w-full max-w-xl p-6 animate-scale-in">
                        <div className="flex items-start justify-between gap-4 mb-6">
                            <div>
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 font-bold mb-2">Complaint Details</p>
                                <h2 className="text-2xl font-black text-slate-800">{selectedPin.title}</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowDetails(false)}
                                className="w-10 h-10 rounded-full bg-white/70 hover:bg-white text-slate-500 hover:text-slate-700 font-black"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-5">
                            <div className="p-4 rounded-2xl bg-white/50">
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Status</p>
                                <p className="text-sm font-bold text-slate-800 capitalize">{selectedPin.status.replace('-', ' ')}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/50">
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Reports</p>
                                <p className="text-sm font-bold text-slate-800">{selectedPin.reports}</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/50 col-span-2">
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Location</p>
                                <p className="text-sm font-bold text-slate-800">{selectedPin.x.toFixed(2)}% map x, {selectedPin.y.toFixed(2)}% map y</p>
                            </div>
                        </div>

                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                            This map card is now interactive. Use the detail view to inspect the hotspot, review the complaint cluster, and follow up on the selected location.
                        </p>

                        <button
                            type="button"
                            onClick={() => setShowDetails(false)}
                            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
