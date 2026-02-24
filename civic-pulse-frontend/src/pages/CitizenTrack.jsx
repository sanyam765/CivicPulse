import React, { useState } from 'react'

const mockTrackData = {
    'CMP-123456': {
        type: 'pothole', title: 'Large pothole on Main Street near the park',
        status: 'in-progress', priority: 'high', location: '28.6139° N, 77.2090° E — New Delhi',
        date: '2024-02-10T10:30:00', assignee: 'Road Department Team B',
        timeline: [
            { status: 'Submitted', time: '2024-02-10 10:30 AM', desc: 'Complaint registered with AI classification.' },
            { status: 'Verified', time: '2024-02-10 11:15 AM', desc: 'Issue verified through satellite imagery.' },
            { status: 'Assigned', time: '2024-02-10 02:00 PM', desc: 'Assigned to Road Department Team B.' },
            { status: 'In Progress', time: '2024-02-11 09:00 AM', desc: 'Crew dispatched. Work in progress.' },
        ],
    },
}

export default function CitizenTrack() {
    const [query, setQuery] = useState('')
    const [result, setResult] = useState(null)
    const [searching, setSearching] = useState(false)
    const [notFound, setNotFound] = useState(false)

    const performSearch = (id) => {
        const searchId = id.trim().toUpperCase()
        if (!searchId) return
        setSearching(true)
        setNotFound(false)
        setResult(null)
        setTimeout(() => {
            // Check localStorage
            const stored = JSON.parse(localStorage.getItem('complaints') || '[]')
            const found = stored.find((c) => c.id === searchId)
            if (found) {
                setResult({
                    type: found.type, title: found.title || found.description || found.type,
                    status: found.status, priority: found.priority || 'medium', location: found.location || 'Auto-detected',
                    date: found.date, assignee: 'Pending Assignment',
                    timeline: [
                        { status: 'Submitted', time: new Date(found.date).toLocaleString(), desc: 'Complaint registered successfully.' },
                        { status: 'Pending Review', time: 'Just now', desc: 'Your report is being analyzed by our system.' }
                    ],
                })
            } else if (mockTrackData[searchId]) {
                setResult(mockTrackData[searchId])
            } else {
                setNotFound(true)
            }
            setSearching(false)
        }, 1200)
    }

    const handleSearch = () => performSearch(query)

    const statusConfig = {
        pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
        'in-progress': { label: 'In Progress', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
        resolved: { label: 'Resolved', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
        urgent: { label: 'Urgent', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' }
    }

    const getStatusInfo = (s) => statusConfig[s] || statusConfig.pending

    return (
        <div className="min-h-screen relative">
            <div className="pt-28 pb-16 px-6">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">
                            Track Your <span className="gradient-text">Complaint</span>
                        </h1>
                        <p className="text-sm text-slate-400">Enter your complaint ID to check real-time status</p>
                    </div>

                    {/* Search */}
                    <div className="glass rounded-2xl shadow-float p-6 mb-8">
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="e.g. CMP-123456"
                                    className="w-full px-5 py-3.5 bg-white/60 border-2 border-slate-200/60 rounded-xl text-sm font-mono font-semibold text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none transition-all pr-10" />
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                            </div>
                            <button onClick={handleSearch} disabled={searching}
                                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-50">
                                {searching ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Track'}
                            </button>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-3">Try: <button onClick={() => { setQuery('CMP-123456'); performSearch('CMP-123456'); }} className="font-mono text-emerald-500 hover:text-emerald-600 font-bold">CMP-123456</button> for a demo</p>
                    </div>

                    {/* Not Found */}
                    {notFound && (
                        <div className="glass rounded-2xl shadow-float p-10 text-center animate-slide-up">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="font-display text-lg font-bold text-slate-700 mb-2">Not Found</h3>
                            <p className="text-sm text-slate-400">No complaint found with ID "<span className="font-mono font-bold text-slate-500">{query}</span>". Check the ID and try again.</p>
                        </div>
                    )}

                    {/* Result */}
                    {result && (
                        <div className="space-y-6 animate-slide-up">
                            {/* Status Card */}
                            <div className="glass rounded-2xl shadow-float p-6">
                                <div className="flex items-start justify-between mb-5">
                                    <div>
                                        <p className="font-mono text-xs font-bold text-slate-400 mb-1">{result.id || query.toUpperCase()}</p>
                                        <h2 className="font-display text-xl font-bold text-slate-800">{result.title}</h2>
                                    </div>
                                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${getStatusInfo(result.status).bg} ${getStatusInfo(result.status).text}`}>
                                        <div className={`w-2 h-2 rounded-full ${getStatusInfo(result.status).dot} ${result.status === 'in-progress' ? 'animate-pulse' : ''}`} />
                                        {getStatusInfo(result.status).label}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: 'Category', value: result.type, icon: '📋' },
                                        { label: 'Priority', value: result.priority, icon: '⚡' },
                                        { label: 'Assigned To', value: result.assignee || 'Pending Assignment', icon: '👤' },
                                        { label: 'Location', value: result.location, icon: '📍' },
                                    ].map((item, i) => (
                                        <div key={i} className="p-3 rounded-xl bg-white/40">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{item.icon} {item.label}</p>
                                            <p className="text-xs font-semibold text-slate-700 capitalize">{item.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="glass rounded-2xl shadow-float p-6">
                                <h3 className="font-display text-base font-bold text-slate-800 mb-5">Resolution Timeline</h3>
                                <div className="space-y-0">
                                    {result.timeline.map((event, i) => (
                                        <div key={i} className="relative flex gap-4 pb-6 last:pb-0">
                                            {/* Line */}
                                            {i < result.timeline.length - 1 && (
                                                <div className="absolute left-[15px] top-8 w-[2px] h-[calc(100%-8px)] bg-gradient-to-b from-emerald-200 to-transparent" />
                                            )}
                                            {/* Dot */}
                                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${i === result.timeline.length - 1
                                                ? 'bg-gradient-to-br from-emerald-400 to-teal-400 shadow-lg shadow-emerald-500/20 glow-breathe'
                                                : 'bg-emerald-100'
                                                }`}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={i === result.timeline.length - 1 ? 'white' : '#10b981'} strokeWidth="3">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            </div>
                                            {/* Info */}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-sm font-bold text-slate-700">{event.status}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium">{event.time}</span>
                                                </div>
                                                <p className="text-xs text-slate-500">{event.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!result && !notFound && (
                        <div className="glass rounded-2xl shadow-float p-14 text-center">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 text-slate-200">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <p className="text-sm text-slate-400 font-medium">Enter a complaint ID above to see tracking details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
