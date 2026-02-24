import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CitizenMyComplaints() {
    const [complaints, setComplaints] = useState([])
    const [filter, setFilter] = useState('all')

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('complaints') || '[]')
        // Mix with mock data if empty
        if (stored.length === 0) {
            setComplaints([
                { id: 'CMP-100201', type: 'pothole', title: 'Large pothole on Main Street', status: 'in-progress', priority: 'high', date: new Date(Date.now() - 2 * 86400000).toISOString() },
                { id: 'CMP-100189', type: 'streetlight', title: 'Street light not working near school', status: 'resolved', priority: 'medium', date: new Date(Date.now() - 5 * 86400000).toISOString() },
                { id: 'CMP-100175', type: 'garbage', title: 'Overflowing bins on Market Road', status: 'pending', priority: 'low', date: new Date(Date.now() - 1 * 86400000).toISOString() },
            ])
        } else {
            setComplaints(stored.reverse())
        }
    }, [])

    const filtered = filter === 'all' ? complaints : complaints.filter((c) => c.status === filter)

    const statusConf = {
        pending: { label: 'Pending', color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-700' },
        'in-progress': { label: 'In Progress', color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-700' },
        resolved: { label: 'Resolved', color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-700' },
        urgent: { label: 'Urgent', color: '#ef4444', bg: 'bg-red-50', text: 'text-red-700' },
    }

    const categoryIcons = {
        pothole: '🕳️', streetlight: '💡', garbage: '🗑️', water: '💧', drainage: '🌊', road: '🛣️'
    }

    const priorityConf = {
        low: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
        medium: { bg: 'bg-amber-50', text: 'text-amber-700' },
        high: { bg: 'bg-red-50', text: 'text-red-700' },
    }

    return (
        <div className="min-h-screen relative">
            <div className="pt-28 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                        <div>
                            <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">
                                My <span className="gradient-text">Complaints</span>
                            </h1>
                            <p className="text-sm text-slate-400">{complaints.length} total complaint{complaints.length !== 1 ? 's' : ''}</p>
                        </div>

                        {/* Filter */}
                        <div className="flex gap-2">
                            {['all', 'pending', 'in-progress', 'resolved'].map((f) => (
                                <button key={f} onClick={() => setFilter(f)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filter === f ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/20' : 'text-slate-500 hover:bg-white/50'
                                        }`}>
                                    {f === 'all' ? 'All' : statusConf[f]?.label || f}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Complaint Cards */}
                    {filtered.length === 0 ? (
                        <div className="glass rounded-2xl shadow-float p-14 text-center">
                            <div className="text-5xl mb-4">📭</div>
                            <h3 className="font-display text-lg font-bold text-slate-700 mb-2">No Complaints Found</h3>
                            <p className="text-sm text-slate-400">
                                {filter === 'all' ? "You haven't submitted any complaints yet." : `No "${statusConf[filter]?.label || filter}" complaints found.`}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filtered.map((c, i) => {
                                const sc = statusConf[c.status] || statusConf.pending
                                const pc = priorityConf[c.priority] || priorityConf.medium
                                return (
                                    <div key={c.id}
                                        className="glass rounded-2xl shadow-float hover:shadow-float-hover p-5 transition-all duration-500 group spring-hover animate-slide-up"
                                        style={{ animationDelay: `${i * 80}ms` }}>
                                        <div className="flex items-start gap-4">
                                            {/* Icon */}
                                            <div className="w-12 h-12 rounded-xl bg-white/60 shadow-sm flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                                                {categoryIcons[c.type] || '📋'}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <span className="font-mono text-[10px] font-bold text-slate-400">{c.id}</span>
                                                    <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${sc.bg} ${sc.text}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'in-progress' ? 'animate-pulse' : ''}`} style={{ backgroundColor: sc.color }} />
                                                        {sc.label}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${pc.bg} ${pc.text}`}>
                                                        {c.priority}
                                                    </span>
                                                </div>
                                                <h3 className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors truncate">
                                                    {c.title || c.type}
                                                </h3>
                                                <p className="text-xs text-slate-400 mt-1">
                                                    {new Date(c.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>

                                            {/* Action */}
                                            <Link to={`/citizen/track`}
                                                className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-emerald-500 hover:text-emerald-600 transition-colors opacity-0 group-hover:opacity-100">
                                                Track
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                    <polyline points="9 18 15 12 9 6" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
