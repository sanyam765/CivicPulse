import React, { useState, useRef, useEffect } from 'react'
import TopBar from '../components/shared/TopBar'
import { useRole } from '../context/RoleContext'

// 3D Tilt Card Component
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

// Stat Card Component
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
                {/* Icon */}
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cs.iconBg} flex items-center justify-center shadow-lg ${cs.iconShadow} group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-white">{icon}</span>
                    </div>
                    {/* Status dot */}
                    <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-glow" />
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Live</span>
                    </div>
                </div>

                {/* Value */}
                <div className="mb-1">
                    <span className="font-display text-3xl font-extrabold text-slate-800">
                        {value.includes('%') ? `${displayValue}%` :
                            value.includes('K') ? `${(displayValue / 1000).toFixed(1)}K` :
                                value.includes('h') ? `${displayValue}h` :
                                    displayValue.toLocaleString()}
                    </span>
                </div>

                {/* Label */}
                <p className="text-sm font-medium text-slate-500 mb-3">{label}</p>

                {/* Change indicator */}
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

                {/* Bottom shimmer line */}
                <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-full shimmer-overlay" style={{ background: `linear-gradient(90deg, transparent, ${color === 'emerald' ? '#10b981' : color === 'teal' ? '#14b8a6' : color === 'cyan' ? '#06b6d4' : '#f59e0b'}40, transparent)` }} />
                </div>
            </div>
        </TiltCard>
    )
}

// Activity Item Component
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
            {/* Avatar */}
            <div className="w-10 h-10 rounded-xl bg-white/80 shadow-sm flex items-center justify-center text-lg group-hover:scale-110 transition-transform group-hover:shadow-md">
                {typeIcons[type] || '📋'}
            </div>

            {/* Content */}
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

            {/* Status Badge */}
            <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColors[status]} badge-float`}>
                {status.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
            </div>

            {/* Time */}
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">{time}</span>
        </div>
    )
}

// Mini Map Component
function MiniMap() {
    const pins = [
        { x: 25, y: 30, type: 'urgent', delay: 0 },
        { x: 55, y: 20, type: 'pending', delay: 200 },
        { x: 75, y: 45, type: 'resolved', delay: 400 },
        { x: 40, y: 60, type: 'in-progress', delay: 600 },
        { x: 60, y: 70, type: 'pending', delay: 800 },
        { x: 30, y: 50, type: 'resolved', delay: 1000 },
        { x: 85, y: 25, type: 'urgent', delay: 1200 },
        { x: 15, y: 75, type: 'in-progress', delay: 1400 },
    ]

    const pinColors = {
        urgent: '#ef4444',
        pending: '#f59e0b',
        'in-progress': '#3b82f6',
        resolved: '#10b981',
    }

    return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50">
            {/* Map grid */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                }}
            />

            {/* Simulated roads */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 30 L100 30" stroke="#94a3b8" strokeWidth="0.5" fill="none" />
                <path d="M0 60 L100 60" stroke="#94a3b8" strokeWidth="0.5" fill="none" />
                <path d="M35 0 L35 100" stroke="#94a3b8" strokeWidth="0.5" fill="none" />
                <path d="M70 0 L70 100" stroke="#94a3b8" strokeWidth="0.5" fill="none" />
                <path d="M10 10 Q50 50 90 30" stroke="#94a3b8" strokeWidth="0.3" fill="none" />
                <path d="M20 80 Q60 40 90 70" stroke="#94a3b8" strokeWidth="0.3" fill="none" />
            </svg>

            {/* Area labels */}
            <span className="absolute text-[9px] font-bold text-slate-300 uppercase tracking-wider" style={{ top: '15%', left: '10%' }}>Downtown</span>
            <span className="absolute text-[9px] font-bold text-slate-300 uppercase tracking-wider" style={{ top: '45%', left: '55%' }}>Midtown</span>
            <span className="absolute text-[9px] font-bold text-slate-300 uppercase tracking-wider" style={{ top: '78%', left: '25%' }}>Suburbs</span>

            {/* Anti-gravity Pins */}
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
                    {/* Pin shadow */}
                    <div
                        className="absolute w-4 h-1.5 rounded-full bg-black/10 -bottom-3 left-1/2 -translate-x-1/2 map-pin-shadow"
                        style={{ animationDelay: `${pin.delay}ms` }}
                    />
                    {/* Pin body */}
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
                        {/* Pulse ring */}
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

            {/* Legend */}
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

// Progress Ring Component
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

// Category Bar Component
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

export default function Dashboard() {
    const [time, setTime] = useState(new Date())
    const [allComplaints, setAllComplaints] = useState([])
    const { user } = useRole()

    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('complaints') || '[]')
        setAllComplaints(stored.reverse())
    }, [])

    const stats = [
        {
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>,
            label: 'Total Complaints',
            value: (2847 + allComplaints.length).toString(),
            change: '+12.5%',
            changeType: 'up',
            color: 'emerald',
        },
        {
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
            label: 'Pending Review',
            value: (342 + allComplaints.filter(c => c.status === 'pending').length).toString(),
            change: '+8.2%',
            changeType: 'down',
            color: 'amber',
        },
        {
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
            label: 'Resolved Today',
            value: '156',
            change: '+24.1%',
            changeType: 'up',
            color: 'teal',
        },
        {
            icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>,
            label: 'Avg Resolution',
            value: '18h',
            change: '-15.3%',
            changeType: 'up',
            color: 'cyan',
        },
    ]

    const mockActivity = [
        { type: 'pothole', title: 'Large pothole on Main Street', location: 'Main St & 5th Ave', time: '2m ago', status: 'urgent' },
        { type: 'streetlight', title: 'Broken streetlight in park area', location: 'Central Park, North', time: '15m ago', status: 'pending' },
        { type: 'garbage', title: 'Overflowing garbage bins', location: 'Market Street', time: '32m ago', status: 'in-progress' },
        { type: 'water', title: 'Water leakage at intersection', location: 'Oak & Pine Junction', time: '1h ago', status: 'in-progress' },
        { type: 'drainage', title: 'Blocked storm drain', location: 'Riverside Dr', time: '2h ago', status: 'resolved' },
        { type: 'road', title: 'Damaged speed bump', location: 'School Zone, 3rd Ave', time: '3h ago', status: 'pending' },
    ]

    const recentActivity = [
        ...allComplaints.slice(0, 5).map(c => ({
            type: c.type,
            title: c.title,
            location: c.location || 'Auto-detected',
            time: 'Just now',
            status: c.status
        })),
        ...mockActivity
    ].slice(0, 6)

    return (
        <div className="animate-fade-in">
            <TopBar
                title="Dashboard"
                subtitle={`Good ${time.getHours() < 12 ? 'morning' : time.getHours() < 18 ? 'afternoon' : 'evening'}, ${user?.name || 'Admin'} • ${time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`}
            />

            {/* Floating Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} delay={i * 150} />
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Activity Feed */}
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

                {/* Map Overview */}
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
                        <MiniMap />
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Resolution Progress */}
                <div className="glass rounded-2xl shadow-float p-6">
                    <h2 className="font-display text-lg font-bold text-slate-800 mb-1">Resolution Rate</h2>
                    <p className="text-xs text-slate-400 mb-6">Monthly target: 95%</p>

                    <div className="flex items-center justify-center mb-6">
                        <ProgressRing value={87} size={120} strokeWidth={8} />
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-3 rounded-xl bg-white/50">
                            <p className="font-display font-extrabold text-emerald-600 text-lg">156</p>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase">Resolved</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/50">
                            <p className="font-display font-extrabold text-amber-600 text-lg">23</p>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase">Pending</p>
                        </div>
                        <div className="p-3 rounded-xl bg-white/50">
                            <p className="font-display font-extrabold text-blue-600 text-lg">12</p>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase">In Progress</p>
                        </div>
                    </div>
                </div>

                {/* Categories Breakdown */}
                <div className="glass rounded-2xl shadow-float p-6">
                    <h2 className="font-display text-lg font-bold text-slate-800 mb-1">By Category</h2>
                    <p className="text-xs text-slate-400 mb-6">Complaint distribution</p>

                    <div className="space-y-5">
                        <CategoryBar label="Potholes" value={89} maxValue={100} color="#10b981" icon="🕳️" />
                        <CategoryBar label="Streetlights" value={67} maxValue={100} color="#14b8a6" icon="💡" />
                        <CategoryBar label="Garbage" value={54} maxValue={100} color="#06b6d4" icon="🗑️" />
                        <CategoryBar label="Water" value={43} maxValue={100} color="#f59e0b" icon="💧" />
                        <CategoryBar label="Drainage" value={31} maxValue={100} color="#8b5cf6" icon="🌊" />
                        <CategoryBar label="Roads" value={28} maxValue={100} color="#ec4899" icon="🛣️" />
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass rounded-2xl shadow-float p-6">
                    <h2 className="font-display text-lg font-bold text-slate-800 mb-1">Quick Actions</h2>
                    <p className="text-xs text-slate-400 mb-6">Common operations</p>

                    <div className="space-y-3">
                        {[
                            { label: 'Review Pending', icon: '📋', desc: '23 complaints waiting', color: 'from-amber-400 to-orange-400' },
                            { label: 'Assign Crews', icon: '👷', desc: '8 unassigned tasks', color: 'from-blue-400 to-indigo-400' },
                            { label: 'Send Updates', icon: '📨', desc: '12 pending notices', color: 'from-emerald-400 to-teal-400' },
                            { label: 'Generate Report', icon: '📊', desc: 'Weekly summary ready', color: 'from-purple-400 to-pink-400' },
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
