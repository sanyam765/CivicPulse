import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useRole } from '../context/RoleContext'
import { getAllComplaints } from '../services/complaintService'

function Counter({ target, suffix = '', duration = 1500 }) {
    const [count, setCount] = useState(0)
    const ref = useRef(null)
    const [started, setStarted] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting && !started) setStarted(true) },
            { threshold: 0.3 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [started])

    useEffect(() => {
        if (!started) return
        const startTime = performance.now()
        const animate = (now) => {
            const progress = Math.min((now - startTime) / duration, 1)
            const ease = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(ease * target))
            if (progress < 1) requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
    }, [started, target, duration])

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

function TiltCard({ children, className = '' }) {
    const ref = useRef(null)
    const [style, setStyle] = useState({})

    const onMove = (e) => {
        const r = ref.current.getBoundingClientRect()
        const x = e.clientX - r.left, y = e.clientY - r.top
        const rx = ((y - r.height / 2) / (r.height / 2)) * -6
        const ry = ((x - r.width / 2) / (r.width / 2)) * 6
        setStyle({ transform: `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px) translateY(-4px)` })
    }
    const onLeave = () => setStyle({ transform: 'perspective(800px) rotateX(0) rotateY(0) translateZ(0) translateY(0)' })

    return (
        <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className={`transition-all duration-200 ease-out ${className}`} style={style}>
            {children}
        </div>
    )
}

function FAQItem({ q, a, open, toggle }) {
    return (
        <div className="glass rounded-2xl overflow-hidden shadow-sm hover:shadow-float transition-all duration-300">
            <button onClick={toggle} className="w-full flex items-center justify-between px-6 py-5 text-left group">
                <span className="text-sm font-bold text-slate-700 pr-4 group-hover:text-primary-700 transition-colors uppercase tracking-tight">{q}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-mint-400' : ''}`}>
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-400 ${open ? 'max-h-[200px]' : 'max-h-0'}`}>
                <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed font-medium">{a}</p>
            </div>
        </div>
    )
}

// Extract the city name from a complaint address when possible.
// This lets us count unique cities in the impact section without extra backend fields.
function getCityKey(address) {
    if (!address || typeof address !== 'string') return null
    return address.split(',').pop().trim().toLowerCase()
}

// Build dashboard numbers from the complaint list so the landing page stays in sync.
function buildLiveStats(complaints = []) {
    const total = complaints.length
    const resolved = complaints.filter(c => c.status === 'Resolved').length
    const pending = complaints.filter(c => c.status === 'Pending' || c.status === 'In Progress').length

    // Average resolution time is measured from createdAt to resolvedAt for resolved complaints.
    const resolvedComplaints = complaints.filter(c => c.resolvedAt && c.createdAt)
    const avgResolutionTime = resolvedComplaints.length
        ? Math.round(
            resolvedComplaints.reduce((sum, complaint) => {
                const created = new Date(complaint.createdAt)
                const resolvedAt = new Date(complaint.resolvedAt)
                return sum + (resolvedAt - created)
            }, 0) / resolvedComplaints.length / (1000 * 60 * 60)
        )
        : 0

    // Count unique city names from complaint addresses when available.
    const citiesServed = new Set(
        complaints
            .map(complaint => getCityKey(complaint.location?.address))
            .filter(Boolean)
    ).size

    // Use resolution rate as a simple, data-driven satisfaction indicator.
    const citizenSatisfaction = total ? Math.round((resolved / total) * 100) : 0

    return {
        total,
        resolved,
        pending,
        avgResolutionTime,
        citiesServed,
        citizenSatisfaction
    }
}

export default function CitizenLanding() {
    const { switchToAdmin } = useRole()
    const [counts, setCounts] = useState({
        total: 0,
        resolved: 0,
        pending: 0,
        avgResolutionTime: 0,
        citiesServed: 0,
        citizenSatisfaction: 0
    })
    const [loading, setLoading] = useState(true)
    const [faqOpen, setFaqOpen] = useState(null)

    useEffect(() => {
        // Fetch live complaint data on mount and then refresh on a timer.
        const fetchComplaints = async () => {
            try {
                const response = await getAllComplaints()
                const complaints = response.data.complaints
                setCounts(buildLiveStats(complaints))
            } finally {
                setLoading(false)
            }
        }

        fetchComplaints()

        // Poll every 30 seconds so the page updates while the user stays on it.
        const interval = setInterval(fetchComplaints, 30000)

        return () => clearInterval(interval)
    }, [])

    const features = [
        { title: 'Real-Time Tracking', icon: '📱', desc: 'Monitor every local issue from submission to final resolution with real-time updates.' },
        { title: 'Geo-Location Reporting', icon: '📍', desc: 'Pinpoint exact locations with integrated GPS mapping for faster response times.' },
        { title: 'Workflow Management', icon: '⚙️', desc: 'Assign tasks automatically to relevant departments for streamlined city-wide operations.' },
        { title: 'Analytics Dashboard', icon: '📊', desc: 'Gain high-level insights with visualization tools and department performance metrics.' }
    ]

    const processSteps = [
        { num: '1', title: 'Submit Issue', desc: 'Citizens report issues with photos and location tags via our intuitive user interface.', icon: '📸' },
        { num: '2', title: 'Assign & Route', desc: 'Reports are instantly verified and routed to the responsible department for processing.', icon: '🔄' },
        { num: '3', title: 'Track & Resolve', desc: 'Monitor progress through to completion with automatic status updates for all stakeholders.', icon: '✅' }
    ]

    // The impact cards now reflect live complaint data instead of fixed demo numbers.
    const impactStats = [
        { label: 'Cities Served', value: counts.citiesServed, suffix: '+', icon: '🏙️' },
        { label: 'Issues Resolved', value: counts.resolved, suffix: '+', icon: '✅' },
        { label: 'Citizen Satisfaction', value: counts.citizenSatisfaction, suffix: '%', icon: '❤️' },
        { label: 'Avg Resolution Time', value: counts.avgResolutionTime, suffix: 'hrs', icon: '⏱️' }
    ]

    return (
        <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900">

            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Resident Issue Dashboard</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-[1.1] mb-6">
                            A Smarter Way to <br />
                            <span className="text-emerald-500 italic">Manage</span> Civic Issues
                        </h1>
                        <p className="text-lg text-slate-500 mb-10 max-w-xl leading-relaxed">
                            Bridge the gap between citizens and administration. Our platform streamlines complaint reporting, department routing, and resource tracking in one unified interface.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/citizen/submit" className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2">
                                Report an Issue
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                            </Link>
                            <Link to="/citizen/my-complaints" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all">
                                View Dashboard
                            </Link>
                        </div>
                        <div className="mt-12 flex items-center gap-8 border-t border-slate-100 pt-8">
                            <div>
                                {/* Total complaint submissions */}
                                <p className="text-2xl font-bold text-slate-900">{loading ? '...' : counts.total.toLocaleString()}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Reports</p>
                            </div>
                            <div>
                                {/* Complaints marked as resolved */}
                                <p className="text-2xl font-bold text-slate-900">{loading ? '...' : counts.resolved.toLocaleString()}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fixed Issues</p>
                            </div>
                            <div>
                                {/* Open complaints still being worked on */}
                                <p className="text-2xl font-bold text-slate-900">{loading ? '...' : counts.pending.toLocaleString()}</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pending Issues</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-400/10 blur-[100px] rounded-full sm:block hidden" />
                        <div className="relative glass rounded-3xl p-6 shadow-2xl border border-white/50 group hover:shadow-floating transition-all duration-500">

                            <div className="flex items-center justify-between mb-5">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-200 group-hover:bg-red-400 transition-colors duration-300" />
                                    <div className="w-3 h-3 rounded-full bg-slate-200 group-hover:bg-amber-400 transition-colors duration-300 delay-75" />
                                    <div className="w-3 h-3 rounded-full bg-slate-200 group-hover:bg-emerald-400 transition-colors duration-300 delay-150" />
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-full">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">Live System Sync</span>
                                </div>
                            </div>

                            <div className="space-y-3.5">

                                <div className="relative h-36 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden">

                                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.8) 1px, transparent 1px)', backgroundSize: '14px 14px' }} />

                                    <div className="absolute top-6 left-8 w-10 h-10 rounded-full bg-emerald-500/30 blur-md animate-pulse" />
                                    <div className="absolute top-12 right-12 w-8 h-8 rounded-full bg-amber-500/25 blur-md animate-pulse" style={{ animationDelay: '1s' }} />
                                    <div className="absolute bottom-6 left-1/3 w-6 h-6 rounded-full bg-cyan-500/25 blur-md animate-pulse" style={{ animationDelay: '2s' }} />

                                    <div className="absolute top-5 left-7 flex flex-col items-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.9)] z-10" />
                                        <div className="w-0.5 h-3 bg-emerald-400/60" />
                                    </div>
                                    <div className="absolute top-10 right-10 flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)] z-10" />
                                        <div className="w-0.5 h-2.5 bg-amber-400/60" />
                                    </div>
                                    <div className="absolute bottom-8 left-[38%] flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.9)] z-10" />
                                        <div className="w-0.5 h-2.5 bg-cyan-400/60" />
                                    </div>
                                    <div className="absolute bottom-10 right-6 flex flex-col items-center">
                                        <div className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.9)] z-10" />
                                        <div className="w-0.5 h-2.5 bg-rose-400/60" />
                                    </div>

                                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                        <line x1="15%" y1="25%" x2="38%" y2="70%" stroke="rgba(16,185,129,0.2)" strokeWidth="1" strokeDasharray="4 4" />
                                        <line x1="38%" y1="70%" x2="80%" y2="35%" stroke="rgba(251,191,36,0.2)" strokeWidth="1" strokeDasharray="4 4" />
                                        <line x1="80%" y1="35%" x2="85%" y2="70%" stroke="rgba(6,182,212,0.15)" strokeWidth="1" strokeDasharray="4 4" />
                                    </svg>

                                    <div className="absolute bottom-2 left-2.5 flex items-center gap-3">
                                        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><span className="text-[8px] font-bold text-emerald-300/80">Resolved</span></div>
                                        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-amber-400" /><span className="text-[8px] font-bold text-amber-300/80">In Progress</span></div>
                                        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-400" /><span className="text-[8px] font-bold text-rose-300/80">New</span></div>
                                    </div>

                                    <div className="absolute top-2.5 right-3 bg-white/10 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-white/10">
                                        <span className="text-[9px] font-bold text-white/60 block leading-none">Active Pins</span>
                                        <span className="text-sm font-black text-white leading-none">1,247</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2.5">
                                    <div className="bg-white/80 p-3 rounded-xl border border-white shadow-sm hover:shadow-md transition-shadow">
                                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Active Crews</span>
                                        <div className="flex items-end justify-between">
                                            <span className="text-xl font-black text-slate-800 leading-none">24</span>
                                            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-md">+3</span>
                                        </div>
                                    </div>
                                    <div className="bg-white/80 p-3 rounded-xl border border-white shadow-sm hover:shadow-md transition-shadow">
                                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Resolution</span>
                                        <div className="flex items-end justify-between">
                                            <span className="text-xl font-black text-slate-800 leading-none">92<span className="text-[10px]">%</span></span>
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                                        </div>
                                    </div>
                                    <div className="bg-white/80 p-3 rounded-xl border border-white shadow-sm hover:shadow-md transition-shadow">
                                        <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Response</span>
                                        <div className="flex items-end justify-between">
                                            <span className="text-xl font-black text-slate-800 leading-none">14<span className="text-[10px]">h</span></span>
                                            <span className="text-[9px] font-bold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded-md">Fast</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/60 p-3.5 rounded-xl border border-white/80">
                                    <div className="flex items-center justify-between mb-2.5">
                                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Department Load</span>
                                        <span className="text-[8px] font-bold text-slate-400">This Week</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-slate-500 w-16 shrink-0">Roads</span>
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: '78%' }} /></div>
                                            <span className="text-[9px] font-bold text-slate-600 w-7 text-right">78%</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-slate-500 w-16 shrink-0">Utilities</span>
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-cyan-500 rounded-full" style={{ width: '56%' }} /></div>
                                            <span className="text-[9px] font-bold text-slate-600 w-7 text-right">56%</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-slate-500 w-16 shrink-0">Sanitation</span>
                                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{ width: '42%' }} /></div>
                                            <span className="text-[9px] font-bold text-slate-600 w-7 text-right">42%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-400" />
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-xs border border-slate-100/50 shrink-0">🛣️</div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <div className="text-[9px] font-bold text-slate-400">Pothole Repaired</div>
                                                    <div className="text-[8px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded-sm uppercase">Resolved</div>
                                                </div>
                                                <div className="text-[11px] font-bold text-slate-700 truncate">Main St. Intersection — 2h ago</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 relative overflow-hidden">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-400" />
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-xs border border-slate-100/50 shrink-0">💡</div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <div className="text-[9px] font-bold text-slate-400">Streetlight Outage</div>
                                                    <div className="text-[8px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-sm uppercase">In Progress</div>
                                                </div>
                                                <div className="text-[11px] font-bold text-slate-700 truncate">Oak Ave. & 5th — 41m ago</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 bg-slate-50/50">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">Features That Keep Your City Moving</h2>
                    <p className="text-slate-500 mb-16 max-w-2xl mx-auto">
                        Everything your administration needs to respond faster, manage better, and communicate clearer with citizens.
                    </p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="how-it-works" className="py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">A Streamlined 3-Step Process</h2>
                    <div className="grid md:grid-cols-3 gap-12 mt-20 relative">

                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 hidden md:block -translate-y-12" />

                        {processSteps.map((step, i) => (
                            <div key={i} className="relative z-10 transition-all hover:-translate-y-2">
                                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white text-xl font-bold flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-600/20">
                                    {step.num}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
                                <p className="text-slate-500 max-w-xs mx-auto leading-relaxed">{step.desc}</p>
                                <div className="mt-8 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm inline-block">
                                    <span className="text-3xl grayscale group-hover:grayscale-0 transition-all">{step.icon}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 px-6 bg-slate-50/50">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                        <div className="bg-white p-2 rounded-[2.5rem] shadow-2xl border border-white">
                            <div className="bg-emerald-600 rounded-[2rem] p-8 text-white min-h-[400px]">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 rounded-full bg-white/40" />
                                        <div className="w-2 h-2 rounded-full bg-white/40" />
                                        <div className="w-2 h-2 rounded-full bg-white/40" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div className="h-32 bg-white/10 rounded-2xl animate-pulse" />
                                    <div className="h-32 bg-white/10 rounded-2xl animate-pulse" />
                                </div>
                                <div className="flex items-end gap-2 h-32">
                                    <div className="flex-1 bg-white/20 rounded-t-lg h-[40%]" />
                                    <div className="flex-1 bg-white/40 rounded-t-lg h-[60%]" />
                                    <div className="flex-1 bg-white/60 rounded-t-lg h-[80%]" />
                                    <div className="flex-1 bg-white/80 rounded-t-lg h-[100%]" />
                                    <div className="flex-1 bg-white/40 rounded-t-lg h-[50%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 lg:order-2">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Empower Your Administrators</h2>
                        <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                            Our powerful admin backend gives city managers the data they need to optimize urban services. Identify hot-spots, track department performance, and generate legislative reports with a single click.
                        </p>
                        <ul className="space-y-5 mb-10">
                            {[
                                'Real-time analysis of trending issues',
                                'Department-level KPI tracking',
                                'Automated citizen communication'
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(circle, rgba(16,185,129,1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-[80px]" />
                        <div className="absolute bottom-0 left-0 w-56 h-56 bg-teal-500/10 rounded-full blur-[80px]" />
                        <div className="relative z-10">
                            {/* Live impact numbers pulled from the complaints API */}
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">Impact That Speaks for Itself</h2>
                            <p className="text-slate-400 text-center mb-12 max-w-md mx-auto text-sm">Real numbers from real communities using CivicPulse every day.</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {impactStats.map((stat, i) => (
                                    <div key={i} className="text-center group">
                                        <div className="text-3xl mb-3 group-hover:scale-125 transition-transform">{stat.icon}</div>
                                        <div className="text-3xl md:text-4xl font-black text-white mb-1">
                                            <Counter target={stat.value} suffix={stat.suffix} />
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group">

                    <div className="absolute -top-20 -left-20 w-72 h-72 border border-white/10 rounded-full" />
                    <div className="absolute -bottom-16 -right-16 w-56 h-56 border border-white/10 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full" />

                    <div className="absolute top-8 right-16 w-3 h-3 bg-white/30 rounded-full animate-pulse" />
                    <div className="absolute bottom-12 left-20 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    <div className="absolute top-1/3 left-12 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                    <div className="relative z-10 text-white">
                        <p className="text-sm font-bold uppercase tracking-widest text-emerald-200 mb-4">Ready to transform your city?</p>
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            Build a More Responsive City <br className="hidden md:block" /> with Civic Pulse
                        </h2>
                        <p className="text-emerald-100/80 mb-10 max-w-lg mx-auto">Join 120+ municipalities already using CivicPulse to close tickets faster and keep citizens happier.</p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Link to="/citizen/submit" className="px-10 py-5 bg-white text-emerald-700 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-2xl">
                                Get Started Today
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                        <div>
                            <Link to="/" className="flex items-center gap-2.5 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                                </div>
                                <span className="text-xl font-bold text-slate-900">CivicPulse</span>
                            </Link>
                            <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                                Empowering communities through smarter civic infrastructure and transparent administration.
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            &copy; 2024 Civic Pulse. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}