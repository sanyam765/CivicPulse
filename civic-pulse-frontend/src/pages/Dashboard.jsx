import React, { useState, useRef, useEffect } from 'react'
import TopBar from '../components/shared/TopBar'
import { useRole } from '../context/RoleContext'
import { getAllComplaints } from '../services/complaintService'

function TiltCard({ children, className = '', delay = 0 }) {
    const cardRef = useRef(null)
    const [transform, setTransform] = useState('')
    const [glareStyle, setGlareStyle] = useState({})

    const handleMouseMove = (e) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateX = ((y - centerY) / centerY) * -8
        const rotateY = ((x - centerX) / centerX) * 8

        setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`)
        setGlareStyle({
            background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15) 0%, transparent 60%)`,
            opacity: 1,
        })
    }

    const handleMouseLeave = () => {
        setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)')
        setGlareStyle({ opacity: 0 })
    }

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative transition-all duration-300 ease-out ${className}`}
            style={{
                transform,
                animationDelay: `${delay}ms`,
            }}
        >
            {children}
            <div
                className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300"
                style={glareStyle}
            />
        </div>
    )
}

function StatCard({ icon, label, value, change, changeType, color, delay }) {
    const [displayValue, setDisplayValue] = useState(0)
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''))

    useEffect(() => {
        let start = 0
        const end = numericValue
        const duration = 1500
        const startTime = performance.now()

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easeOut = 1 - Math.pow(1 - progress, 3)
            setDisplayValue(Math.floor(easeOut * end))
            if (progress < 1) requestAnimationFrame(animate)
        }

        const timer = setTimeout(() => requestAnimationFrame(animate), delay)
        return () => clearTimeout(timer)
    }, [numericValue, delay])

    const colorStyles = {
        emerald: {
            iconBg: 'from-emerald-400 to-emerald-600',
            iconShadow: 'shadow-emerald-500/30',
            accent: 'text-emerald-600',
            changeUp: 'text-emerald-600 bg-emerald-50',
        },
        teal: {
            iconBg: 'from-teal-400 to-teal-600',
            iconShadow: 'shadow-teal-500/30',
            accent: 'text-teal-600',
            changeUp: 'text-teal-600 bg-teal-50',
        },
        cyan: {
            iconBg: 'from-cyan-400 to-cyan-600',
            iconShadow: 'shadow-cyan-500/30',
            accent: 'text-cyan-600',
            changeUp: 'text-cyan-600 bg-cyan-50',
        },
        amber: {
            iconBg: 'from-amber-400 to-amber-600',
            iconShadow: 'shadow-amber-500/30',
            accent: 'text-amber-600',
            changeUp: 'text-amber-600 bg-amber-50',
        },
    }

    const cs = colorStyles[color] || colorStyles.emerald

    return (
        <TiltCard delay={delay}>
            <div className="glass rounded-2xl p-6 shadow-float hover:shadow-float-hover transition-all duration-500 group levitate cursor-default"
                style={{ animationDelay: `${delay}ms` }}>

                <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cs.iconBg} flex items-center justify-center shadow-lg ${cs.iconShadow} group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-white">{icon}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-glow" />
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Live</span>
                    </div>
                </div>

                <div className="mb-1">
                    <span className="font-display text-3xl font-extrabold text-slate-800">
                        {value.includes('%') ? `${displayValue}%` :
                            value.includes('K') ? `${(displayValue / 1000).toFixed(1)}K` :
                                value.includes('h') ? `${displayValue}h` :
                                    displayValue.toLocaleString()}
                    </span>
                </div>

                <p className="text-sm font-medium text-slate-500 mb-3">{label}</p>

                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${changeType === 'up' ? cs.changeUp : 'text-red-600 bg-red-50'
                        }`}>
                        {changeType === 'up' ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="18 15 12 9 6 15" />
                            </svg>
                        ) : (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        )}
                        {change}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">vs last week</span>
                </div>

                <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-full shimmer-overlay" style={{ background: `linear-gradient(90deg, transparent, ${color === 'emerald' ? '#10b981' : color === 'teal' ? '#14b8a6' : color === 'cyan' ? '#06b6d4' : '#f59e0b'}40, transparent)` }} />
                </div>
            </div>
        </TiltCard>
    )
}

function ActivityItem({ type, title, location, time, status, delay }) {
    const statusColors = {
        pending: 'bg-amber-100 text-amber-700 border-amber-200',
        'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
        resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        urgent: 'bg-red-100 text-red-700 border-red-200',
    }

    const typeIcons = {
        pothole: '🕳️',
        streetlight: '💡',
        garbage: '🗑️',
        water: '💧',
        drainage: '🌊',
        road: '🛣️',
    }

    return (
        <div
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/60 transition-all duration-300 group cursor-pointer spring-hover"
            style={{ animationDelay: `${delay}ms` }}
        >

            <div className="w-10 h-10 rounded-xl bg-white/80 shadow-sm flex items-center justify-center text-lg group-hover:scale-110 transition-transform group-hover:shadow-md">
                {typeIcons[type] || '📋'}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-emerald-700 transition-colors">
                    {title}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                    </svg>
                    {location}
                </p>
            </div>

            <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColors[status]} badge-float`}>
                {status.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
            </div>

            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{time}</span>
        </div>
    )
}

function MiniMap({ complaints }) {
    const pins = complaints.slice(0, 16).map((complaint, index) => ({
        x: Number.isFinite(complaint.location?.longitude)
            ? Math.min(90, Math.max(10, ((complaint.location.longitude + 180) / 360) * 100))
            : 15 + (index * 11) % 70,
        y: Number.isFinite(complaint.location?.latitude)
            ? Math.min(90, Math.max(10, ((90 - complaint.location.latitude) / 180) * 100))
            : 15 + (index * 7) % 70,
        type: complaint.status === 'Resolved'
            ? 'resolved'
            : complaint.status === 'In Progress'
                ? 'in-progress'
                : 'pending',
        delay: index * 120,
    }))

    const pinColors = {
        urgent: '#ef4444',
        pending: '#f59e0b',
        'in-progress': '#3b82f6',
        resolved: '#10b981',
    }

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50">

            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                }}
            />

            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 30 L100 30" stroke="#94a3b8" strokeWidth="0.5" fill="none" />
                <path d="M0 60 L100 60" stroke="#94a3b8" strokeWidth="0.5" fill="none" />
                <path d="M35 0 L35 100" stroke="#94a3b8" strokeWidth="0.5" fill="none" />
                <path d="M70 0 L70 100" stroke="#94a3b8" strokeWidth="0.5" fill="none" />
                <path d="M10 10 Q50 50 90 30" stroke="#94a3b8" strokeWidth="0.3" fill="none" />
                <path d="M20 80 Q60 40 90 70" stroke="#94a3b8" strokeWidth="0.3" fill="none" />
            </svg>

            <span className="absolute text-[9px] font-bold text-slate-300 uppercase tracking-wider" style={{ top: '15%', left: '10%' }}>Downtown</span>
            <span className="absolute text-[9px] font-bold text-slate-300 uppercase tracking-wider" style={{ top: '45%', left: '55%' }}>Midtown</span>
            <span className="absolute text-[9px] font-bold text-slate-300 uppercase tracking-wider" style={{ top: '78%', left: '25%' }}>Suburbs</span>

            {pins.map((pin, i) => (
                <div
                    key={i}
                    className="absolute cursor-pointer group"
                    style={{
                        left: `${pin.x}%`,
                        top: `${pin.y}%`,
                        animationDelay: `${pin.delay}ms`,
                    }}
                >

                    <div
                        className="absolute w-4 h-1.5 rounded-full bg-black/10 -bottom-3 left-1/2 -translate-x-1/2 map-pin-shadow"
                        style={{ animationDelay: `${pin.delay}ms` }}
                    />

                    <div
                        className="relative map-pin group-hover:scale-125 transition-transform"
                        style={{ animationDelay: `${pin.delay}ms` }}
                    >
                        <div
                            className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                            style={{
                                backgroundColor: pinColors[pin.type],
                                boxShadow: `0 0 10px ${pinColors[pin.type]}60`,
                            }}
                        />

                        {pin.type === 'urgent' && (
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    border: `2px solid ${pinColors[pin.type]}`,
                                    animation: 'pulse-ring 2s ease-out infinite',
                                    animationDelay: `${pin.delay}ms`,
                                }}
                            />
                        )}
                    </div>
                </div>
            ))}

            <div className="absolute bottom-3 right-3 glass rounded-lg px-3 py-2 shadow-sm">
                <div className="flex items-center gap-3 text-[9px] font-semibold text-slate-500">
                    {Object.entries(pinColors).map(([key, color]) => (
                        <div key={key} className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                            <span className="capitalize">{key.replace('-', ' ')}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function ProgressRing({ value, size = 80, strokeWidth = 6, color = '#10b981' }) {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const [offset, setOffset] = useState(circumference)

    useEffect(() => {
        const timer = setTimeout(() => {
            setOffset(circumference - (value / 100) * circumference)
        }, 500)
        return () => clearTimeout(timer)
    }, [value, circumference])

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(16,185,129,0.1)"
                    strokeWidth={strokeWidth}
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-1500 ease-out"
                    style={{
                        filter: `drop-shadow(0 0 4px ${color}60)`,
                        transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display font-extrabold text-lg text-slate-700">{value}%</span>
            </div>
        </div>
    )
}

function CategoryBar({ label, value, maxValue, color, icon }) {
    const [width, setWidth] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            setWidth((value / maxValue) * 100)
        }, 600)
        return () => clearTimeout(timer)
    }, [value, maxValue])

    return (
        <div className="flex items-center gap-3 group">
            <span className="text-lg w-8 text-center">{icon}</span>
            <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-semibold text-slate-600">{label}</span>
                    <span className="text-sm font-bold text-slate-700">{value}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-1000 ease-out progress-glow"
                        style={{
                            width: `${width}%`,
                            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
                            transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

const formatRelativeTime = (dateValue) => {
    if (!dateValue) return 'Just now'

    const timestamp = new Date(dateValue).getTime()
    if (!Number.isFinite(timestamp)) return 'Just now'

    const diffMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / (1000 * 60)))
    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
}

const buildRecentActivity = (complaints) => {
    // Use the newest meaningful timestamp for each complaint so the feed reflects the latest live action.
    return complaints
        .map((complaint) => {
            const latestActivityAt = complaint.resolvedAt || complaint.updatedAt || complaint.createdAt
            const statusKey = (complaint.status || 'Pending').toLowerCase().replace(/\s+/g, '-')

            return {
                type: complaint.complaintType,
                title: complaint.complaintType,
                location: complaint.location?.address || 'Auto-detected location',
                time: formatRelativeTime(latestActivityAt),
                status: statusKey,
                sortTime: new Date(latestActivityAt || complaint.createdAt || 0).getTime()
            }
        })
        .sort((a, b) => b.sortTime - a.sortTime)
        .slice(0, 6)
}

export default function Dashboard() {
    const [time, setTime] = useState(new Date())
    const [allComplaints, setAllComplaints] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const { user } = useRole()

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await getAllComplaints()
                setAllComplaints(response.data.complaints)
            } catch (err) {
                setError(err.message || 'Failed to load complaints')
            } finally {
                setLoading(false)
            }
        }

        fetchComplaints()
        const interval = setInterval(fetchComplaints, 15000)
        return () => clearInterval(interval)
    }, [])

    const pendingCount = allComplaints.filter(c => c.status === 'Pending').length
    const inProgressCount = allComplaints.filter(c => c.status === 'In Progress').length
    const resolvedCount = allComplaints.filter(c => c.status === 'Resolved').length
    const resolvedTodayCount = allComplaints.filter(c => {
        if (!c.resolvedAt) return false
        return new Date(c.resolvedAt).toDateString() === new Date().toDateString()
    }).length

    const resolvedComplaints = allComplaints.filter(c => c.resolvedAt)
    const avgResolutionHours = resolvedComplaints.length
        ? Math.round(
            resolvedComplaints.reduce((acc, complaint) => {
                return acc + (new Date(complaint.resolvedAt) - new Date(complaint.createdAt))
            }, 0) / resolvedComplaints.length / (1000 * 60 * 60)
        )
        : 0

    const resolutionRate = allComplaints.length
        ? Math.round((resolvedCount / allComplaints.length) * 100)
        : 0

    const categoryCounts = allComplaints.reduce((acc, complaint) => {
        const key = complaint.complaintType || 'other'
        acc[key] = (acc[key] || 0) + 1
        return acc
    }, {})
    const categoryMax = Math.max(...Object.values(categoryCounts), 1)

    const stats = [
        {
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>,
            label: 'Total Complaints',
            value: allComplaints.length.toString(),
            change: '+12.5%',
            changeType: 'up',
            color: 'emerald',
        },
        {
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
            label: 'Pending Review',
            value: pendingCount.toString(),
            change: '+8.2%',
            changeType: 'down',
            color: 'amber',
        },
        {
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
            label: 'Resolved Today',
            value: resolvedTodayCount.toString(),
            change: '+24.1%',
            changeType: 'up',
            color: 'teal',
        },
        {
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>,
            label: 'Avg Resolution',
            value: `${avgResolutionHours}h`,
            change: '-15.3%',
            changeType: 'up',
            color: 'cyan',
        },
    ]

    const recentActivity = buildRecentActivity(allComplaints)

    return (
        <div className="animate-fade-in">
            <TopBar
                title="Dashboard"
                subtitle={`Good ${time.getHours() < 12 ? 'morning' : time.getHours() < 18 ? 'afternoon' : 'evening'}, ${user?.name || 'Admin'} • ${time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
            />

            {loading && (
                <div className="mb-6 glass rounded-2xl p-4 text-sm text-slate-500">
                    Loading live complaints...
                </div>
            )}

            {error && !loading && (
                <div className="mb-6 glass rounded-2xl p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} delay={i * 150} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

                <div className="xl:col-span-2 glass rounded-2xl shadow-float p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-display text-lg font-bold text-slate-800">Recent Activity</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Live complaint feed</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-glow" />
                            <span className="text-xs font-semibold text-emerald-600">Live</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        {recentActivity.map((item, i) => (
                            <ActivityItem key={i} {...item} delay={i * 100} />
                        ))}
                    </div>

                    <button className="w-full mt-4 py-3 text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-xl transition-all">
                        View all complaints →
                    </button>
                </div>

                <div className="glass rounded-2xl shadow-float p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="font-display text-lg font-bold text-slate-800">City Map</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Complaint hotspots</p>
                        </div>
                        <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-50/50 transition-all">
                            Full Map →
                        </button>
                    </div>
                    <div className="h-[280px]">
                        <MiniMap complaints={allComplaints} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                <div className="glass rounded-2xl shadow-float p-6">
                    <h2 className="font-display text-lg font-bold text-slate-800 mb-1">Resolution Rate</h2>
                    <p className="text-xs text-slate-400 mb-6">Monthly target: 95%</p>

                    <div className="flex items-center justify-center mb-6">
                        <ProgressRing value={resolutionRate} size={120} strokeWidth={8} />
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-3 rounded-xl bg-white/50">
                            <p className="font-display font-extrabold text-emerald-600 text-lg">{resolvedCount}</p>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase">Resolved</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/50">
                            <p className="font-display font-extrabold text-amber-600 text-lg">{pendingCount}</p>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase">Pending</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/50">
                            <p className="font-display font-extrabold text-blue-600 text-lg">{inProgressCount}</p>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase">In Progress</p>
                        </div>
                    </div>
                </div>

                <div className="glass rounded-2xl shadow-float p-6">
                    <h2 className="font-display text-lg font-bold text-slate-800 mb-1">By Category</h2>
                    <p className="text-xs text-slate-400 mb-6">Complaint distribution</p>

                    <div className="space-y-5">
                        <CategoryBar label="Potholes" value={categoryCounts.pothole || 0} maxValue={categoryMax} color="#10b981" icon="🕳️" />
                        <CategoryBar label="Streetlights" value={categoryCounts.streetlight || 0} maxValue={categoryMax} color="#14b8a6" icon="💡" />
                        <CategoryBar label="Garbage" value={categoryCounts.garbage || 0} maxValue={categoryMax} color="#06b6d4" icon="🗑️" />
                        <CategoryBar label="Water" value={categoryCounts.water || 0} maxValue={categoryMax} color="#f59e0b" icon="💧" />
                        <CategoryBar label="Drainage" value={categoryCounts.drainage || 0} maxValue={categoryMax} color="#8b5cf6" icon="🌊" />
                        <CategoryBar label="Roads" value={categoryCounts.road || 0} maxValue={categoryMax} color="#ec4899" icon="🛣️" />
                    </div>
                </div>

                <div className="glass rounded-2xl shadow-float p-6">
                    <h2 className="font-display text-lg font-bold text-slate-800 mb-1">Quick Actions</h2>
                    <p className="text-xs text-slate-400 mb-6">Common operations</p>

                    <div className="space-y-3">
                        {[
                            { label: 'Review Pending', icon: '📋', desc: `${pendingCount} complaints waiting`, color: 'from-amber-400 to-orange-400' },
                            { label: 'Assign Crews', icon: '👷', desc: `${inProgressCount} active assignments`, color: 'from-blue-400 to-indigo-400' },
                            { label: 'Send Updates', icon: '📨', desc: `${allComplaints.length} citizens to notify`, color: 'from-emerald-400 to-teal-400' },
                            { label: 'Generate Report', icon: '📊', desc: `${resolvedTodayCount} resolved today`, color: 'from-purple-400 to-pink-400' },
                        ].map((action, i) => (
                            <button
                                key={i}
                                className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/50 hover:bg-white/80 shadow-sm hover:shadow-md transition-all duration-300 group spring-hover text-left"
                            >
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform`}>
                                    {action.icon}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">{action.label}</p>
                                    <p className="text-xs text-slate-400">{action.desc}</p>
                                </div>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
