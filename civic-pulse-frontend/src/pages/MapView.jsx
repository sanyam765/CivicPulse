import React, { useState, useEffect } from 'react'
import TopBar from '../components/shared/TopBar'

const mapPins = [
    { id: 1, x: 18, y: 22, type: 'pothole', title: 'Deep pothole on Main St', status: 'urgent', reports: 15 },
    { id: 2, x: 32, y: 35, type: 'streetlight', title: 'Streetlight outage', status: 'pending', reports: 7 },
    { id: 3, x: 48, y: 18, type: 'garbage', title: 'Illegal waste dump', status: 'in-progress', reports: 23 },
    { id: 4, x: 65, y: 42, type: 'water', title: 'Water main leak', status: 'urgent', reports: 42 },
    { id: 5, x: 78, y: 28, type: 'drainage', title: 'Flood-prone drain', status: 'resolved', reports: 8 },
    { id: 6, x: 22, y: 58, type: 'road', title: 'Cracked pavement', status: 'pending', reports: 11 },
    { id: 7, x: 55, y: 65, type: 'pothole', title: 'Pothole cluster', status: 'in-progress', reports: 31 },
    { id: 8, x: 80, y: 55, type: 'streetlight', title: 'Dark alley concern', status: 'pending', reports: 5 },
    { id: 9, x: 40, y: 80, type: 'garbage', title: 'Bin overflow zone', status: 'urgent', reports: 18 },
    { id: 10, x: 15, y: 75, type: 'water', title: 'Low pressure area', status: 'resolved', reports: 6 },
    { id: 11, x: 62, y: 15, type: 'drainage', title: 'Blocked culvert', status: 'pending', reports: 9 },
    { id: 12, x: 88, y: 72, type: 'road', title: 'Speed bump damage', status: 'resolved', reports: 4 },
    { id: 13, x: 35, y: 50, type: 'pothole', title: 'Intersection damage', status: 'in-progress', reports: 25 },
    { id: 14, x: 72, y: 82, type: 'streetlight', title: 'Park light broken', status: 'urgent', reports: 14 },
]

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
            {/* Shadow on ground */}
            <div
                className="absolute w-6 h-2 rounded-full bg-black/10 top-8 left-1/2 -translate-x-1/2 map-pin-shadow"
                style={{ animationDelay: `${pin.id * 200}ms` }}
            />

            {/* Pin body - floats above ground */}
            <div
                className={`relative map-pin ${isSelected ? 'scale-150' : 'group-hover:scale-125'} transition-transform duration-300`}
                style={{ animationDelay: `${pin.id * 200}ms` }}
            >
                {/* Main dot */}
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

                {/* Pulse ring for urgent */}
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

            {/* Hover tooltip */}
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
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-white/90 -mt-1" />
            </div>
        </div>
    )
}

function HeatmapOverlay() {
    const zones = [
        { x: 30, y: 30, size: 120, intensity: 0.15 },
        { x: 60, y: 50, size: 150, intensity: 0.12 },
        { x: 45, y: 75, size: 100, intensity: 0.18 },
        { x: 75, y: 35, size: 130, intensity: 0.1 },
    ]

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
    const [statusFilter, setStatusFilter] = useState('all')
    const [showHeatmap, setShowHeatmap] = useState(false)

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
                subtitle="Interactive complaint map with anti-gravity pins"
            />

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Map */}
                <div className="xl:col-span-3 glass rounded-2xl shadow-float overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
                    {/* Map Toolbar */}
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

                    {/* Map Area */}
                    <div className="relative w-full h-full bg-gradient-to-br from-emerald-50/60 to-teal-50/60">
                        {/* Grid */}
                        <div className="absolute inset-0 opacity-[0.06]"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)',
                                backgroundSize: '40px 40px',
                            }}
                        />

                        {/* Simulated streets */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* Major roads */}
                            <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(148,163,184,0.15)" strokeWidth="0.8" />
                            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(148,163,184,0.15)" strokeWidth="0.8" />
                            <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(148,163,184,0.15)" strokeWidth="0.8" />
                            <line x1="25" y1="0" x2="25" y2="100" stroke="rgba(148,163,184,0.15)" strokeWidth="0.8" />
                            <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(148,163,184,0.15)" strokeWidth="0.8" />
                            <line x1="75" y1="0" x2="75" y2="100" stroke="rgba(148,163,184,0.15)" strokeWidth="0.8" />
                            {/* Diagonal roads */}
                            <path d="M10 10 Q40 30 80 20" stroke="rgba(148,163,184,0.1)" strokeWidth="0.5" fill="none" />
                            <path d="M20 80 Q50 60 90 85" stroke="rgba(148,163,184,0.1)" strokeWidth="0.5" fill="none" />
                            <path d="M5 50 Q30 40 60 55 Q80 60 95 45" stroke="rgba(148,163,184,0.1)" strokeWidth="0.5" fill="none" />
                        </svg>

                        {/* Area blocks */}
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

                        {/* Heatmap */}
                        {showHeatmap && <HeatmapOverlay />}

                        {/* Pins */}
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

                {/* Sidebar Panel */}
                <div className="space-y-5">
                    {/* Stats */}
                    <div className="glass rounded-2xl shadow-float p-5">
                        <h3 className="font-display text-base font-bold text-slate-800 mb-4">Overview</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Total Reports', value: mapPins.length, color: '#10b981' },
                                { label: 'Hotspot Zones', value: 4, color: '#ef4444' },
                                { label: 'Active Crews', value: 6, color: '#3b82f6' },
                                { label: 'Avg Response', value: '2.4h', color: '#f59e0b' },
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

                    {/* Selected Pin Detail */}
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
                            <button className="w-full mt-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all hover:-translate-y-0.5">
                                View Full Details
                            </button>
                        </div>
                    )}

                    {/* Legend */}
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
        </div>
    )
}
