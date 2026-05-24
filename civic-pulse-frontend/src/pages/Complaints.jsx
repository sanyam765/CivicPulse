import React, { useState, useRef, useEffect } from 'react'
import TopBar from '../components/shared/TopBar'
import { useRole } from '../context/RoleContext'
import { updateComplaint } from '../services/complaintService'
import { getAllComplaints } from '../services/complaintService'

function TiltCard3D({ children, className = '' }) {
    const cardRef = useRef(null)
    const [style, setStyle] = useState({})

    const handleMouseMove = (e) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = ((y - centerY) / centerY) * -6
        const rotateY = ((x - centerX) / centerX) * 6

        setStyle({
            transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(8px) translateY(-4px)`,
            boxShadow: `${-rotateY * 2}px ${rotateX * 2}px 30px rgba(0,0,0,0.08), 0 20px 50px rgba(0,0,0,0.06)`,
        })
    }

    const handleMouseLeave = () => {
        setStyle({
            transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(0px)',
            boxShadow: '0 8px 32px rgba(16, 185, 129, 0.08)',
        })
    }

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`transition-all duration-200 ease-out ${className}`}
            style={style}
        >
            {children}
        </div>
    )
}

function ComplaintCard({ complaint, index, isAdmin, onStatusUpdate }) {
    const [expanded, setExpanded] = useState(false)

    const typeIcons = {
        pothole: '🕳️',
        streetlight: '💡',
        garbage: '🗑️',
        water: '💧',
        drainage: '🌊',
        road: '🛣️',
    }

    const statusConfig = {
        urgent: { label: 'Urgent', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' },
        pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
        'in-progress': { label: 'In Progress', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
        resolved: { label: 'Resolved', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    }

    const priorityConfig = {
        high: { label: 'High', color: 'text-red-600' },
        medium: { label: 'Medium', color: 'text-amber-600' },
        low: { label: 'Low', color: 'text-emerald-600' },
    }

    const sc = statusConfig[complaint.status] || statusConfig.pending
    const pc = priorityConfig[complaint.priority] || priorityConfig.medium

    return (
        <TiltCard3D>
            <div
                className={`glass rounded-2xl overflow-hidden shadow-float hover:shadow-float-hover transition-all duration-500 cursor-pointer group ${complaint.status === 'urgent' ? 'ring-1 ring-red-200/60' : ''
                    }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setExpanded(!expanded)}
            >

                <div className={`h-1 w-full ${complaint.status === 'urgent' ? 'bg-gradient-to-r from-red-400 to-orange-400' :
                    complaint.status === 'in-progress' ? 'bg-gradient-to-r from-blue-400 to-indigo-400' :
                        complaint.status === 'resolved' ? 'bg-gradient-to-r from-emerald-400 to-teal-400' :
                            'bg-gradient-to-r from-amber-400 to-yellow-400'
                    }`} />

                <div className="p-5">

                    <div className="flex items-start gap-4 mb-3">
                        <div className="w-11 h-11 rounded-xl bg-white/80 shadow-sm flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                            {typeIcons[complaint.type] || '📋'}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[11px] font-bold text-slate-400 font-mono">{complaint.id}</span>
                                <span className="text-slate-300">•</span>
                                <span className="text-[11px] font-medium text-slate-400">{new Date(complaint.date).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug">
                                {complaint.title}
                            </h3>
                        </div>

                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${sc.bg} ${sc.text} ${sc.border} badge-float flex-shrink-0`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${complaint.status === 'urgent' ? 'pulse-glow' : ''}`} />
                            {sc.label}
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3 ml-[60px]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span className="font-medium truncate">{complaint.location}</span>
                    </div>

                    {expanded && (
                        <div className="mt-4 pt-4 border-t border-slate-100/80 animate-slide-up ml-[60px]">
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                {complaint.description}
                            </p>

                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className={`font-bold ${pc.color}`}>● {pc.label} Priority</span>
                                </div>
                                {complaint.assignee && (
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                        <span className="font-medium">{complaint.assignee}</span>
                                    </div>
                                )}
                            </div>

                            {isAdmin && expanded && (
                                <div
                                    className="mt-4 flex flex-wrap items-center gap-3"
                                    onClick={(e) => e.stopPropagation()}
                                    onMouseDown={(e) => e.stopPropagation()}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Admin status</span>
                                        <select
                                            value={complaint.backendStatus}
                                            onChange={(e) => onStatusUpdate(complaint.id, e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700"
                                        >
                                            {/* These values must match the backend enum exactly. */}
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between mt-3 ml-[60px]">
                        <div className="flex items-center gap-4">
                            <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-600 transition-colors group/btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover/btn:scale-110 transition-transform">
                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                                    <path d="M4 18h2" />
                                </svg>
                                <span className="font-semibold">{complaint.upvotes || 0}</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-blue-600 transition-colors group/btn">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover/btn:scale-110 transition-transform">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                <span className="font-semibold">{complaint.comments || 0}</span>
                            </button>
                        </div>

                        <svg
                            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            className={`text-slate-300 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </div>
                </div>
            </div>
        </TiltCard3D>
    )
}

export default function Complaints() {
    const { role } = useRole()
    const [allComplaints, setAllComplaints] = useState([])
    const [filter, setFilter] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await getAllComplaints()
                const complaints = response.data.complaints

                setAllComplaints(
                    complaints.map((complaint) => ({
                        id: complaint.complaintId,
                        title: complaint.complaintType,
                        type: complaint.complaintType,
                        location: complaint.location?.address
                            || (complaint.location?.latitude && complaint.location?.longitude
                                ? `${complaint.location.latitude.toFixed(4)}°, ${complaint.location.longitude.toFixed(4)}°`
                                : 'Location not available'),
                        status: complaint.priority === 'High'
                            ? 'urgent'
                            : complaint.status === 'In Progress'
                                ? 'in-progress'
                                : complaint.status.toLowerCase(),
                        backendStatus: complaint.status,
                        priority: complaint.priority ? complaint.priority.toLowerCase() : 'medium',
                        date: complaint.createdAt,
                        description: complaint.description,
                        assignee: complaint.assignedTo?.name || null,
                        upvotes: 0,
                        comments: 0,
                        image: complaint.image || null,
                    }))
                )
            } catch (err) {
                setError(err.message || 'Failed to load complaints')
            } finally {
                setLoading(false)
            }
        }

        fetchComplaints()
    }, [])

    const handleStatusUpdate = async (complaintId, newStatus) => {
        try {
            await updateComplaint(complaintId, { status: newStatus })

            // Update the local copy immediately so the card reflects the admin action without waiting for a refetch.
            setAllComplaints(prev => prev.map((complaint) => {
                if (complaint.id !== complaintId) return complaint

                return {
                    ...complaint,
                    backendStatus: newStatus,
                    status: newStatus === 'In Progress' ? 'in-progress' : newStatus.toLowerCase()
                }
            }))
        } catch (err) {
            alert(err.message || 'Failed to update complaint status')
        }
    }

    const filters = [
        { id: 'all', label: 'All Complaints', count: allComplaints.length },
        { id: 'urgent', label: 'Urgent', count: allComplaints.filter(c => c.status === 'urgent').length },
        { id: 'pending', label: 'Pending', count: allComplaints.filter(c => c.status === 'pending').length },
        { id: 'in-progress', label: 'In Progress', count: allComplaints.filter(c => c.status === 'in-progress').length },
        { id: 'resolved', label: 'Resolved', count: allComplaints.filter(c => c.status === 'resolved').length },
    ]

    const filtered = allComplaints.filter(c => {
        if (filter !== 'all' && c.status !== filter) return false
        if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase()) && !c.id.toLowerCase().includes(searchQuery.toLowerCase())) return false
        return true
    })

    return (
        <div className="animate-fade-in">
            <TopBar
                title="Complaints"
                subtitle="Manage and track all civic complaints"
            />

            <div className="glass rounded-2xl shadow-float p-4 mb-6 flex items-center gap-3 flex-wrap">
                {filters.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${filter === f.id
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'text-slate-500 hover:bg-white/60 hover:text-slate-700'
                            }`}
                    >
                        {f.label}
                        <span className={`inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full ${filter === f.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                            {f.count}
                        </span>
                    </button>
                ))}

                <div className="ml-auto flex items-center gap-2">
                    <div className="relative">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Filter complaints..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white/60 rounded-xl text-sm text-slate-600 placeholder:text-slate-400 border border-white/40 w-[200px] font-medium"
                            style={{ boxShadow: 'none' }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {filtered.map((complaint, index) => (
                    <ComplaintCard
                        key={complaint.id}
                        complaint={complaint}
                        index={index}
                        isAdmin={role === 'admin'}
                        onStatusUpdate={handleStatusUpdate}
                    />
                ))}
            </div>

            {loading && (
                <div className="text-center py-20 glass rounded-2xl shadow-float">
                    <p className="text-sm text-slate-400">Loading complaints from the database...</p>
                </div>
            )}

            {error && !loading && (
                <div className="text-center py-20 glass rounded-2xl shadow-float border border-red-100">
                    <p className="text-sm text-red-600 font-semibold">{error}</p>
                </div>
            )}

            {!loading && !error && filtered.length === 0 && (
                <div className="text-center py-20 glass rounded-2xl shadow-float">
                    <div className="text-5xl mb-4 float-smooth">🔍</div>
                    <h3 className="font-display text-xl font-bold text-slate-600 mb-2">No complaints found</h3>
                    <p className="text-sm text-slate-400">Try adjusting your filters or search query</p>
                </div>
            )}
        </div>
    )
}
