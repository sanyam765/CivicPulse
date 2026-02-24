import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useRole } from '../context/RoleContext'

/* ─── Animated Counter ─── */
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

/* ─── 3D Tilt Card ─── */
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

/* ─── FAQ Accordion ─── */
function FAQItem({ q, a, open, toggle }) {
    return (
        <div className="glass rounded-2xl overflow-hidden shadow-sm hover:shadow-float transition-all duration-300">
            <button onClick={toggle} className="w-full flex items-center justify-between px-6 py-5 text-left group">
                <span className="text-sm font-bold text-slate-700 pr-4 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{q}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`text-slate-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-emerald-500' : ''}`}>
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>
            <div className={`overflow-hidden transition-all duration-400 ${open ? 'max-h-[200px]' : 'max-h-0'}`}>
                <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed font-medium">{a}</p>
            </div>
        </div>
    )
}

export default function CitizenLanding() {
    const { switchToAdmin } = useRole()
    const [counts, setCounts] = useState({ total: 0, resolved: 0, pending: 0 })
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [faqOpen, setFaqOpen] = useState(null)

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('complaints') || '[]')
        setCounts({
            total: stored.length,
            resolved: stored.filter(c => c.status === 'resolved').length,
            pending: stored.filter(c => c.status === 'pending' || c.status === 'in-progress').length
        })
    }, [])

    useEffect(() => {
        const handler = (e) => setMousePos({
            x: (e.clientX / window.innerWidth - 0.5) * 30,
            y: (e.clientY / window.innerHeight - 0.5) * 30,
        })
        window.addEventListener('mousemove', handler)
        return () => window.removeEventListener('mousemove', handler)
    }, [])

    const categories = [
        { icon: '🕳️', label: 'Pothole', desc: 'Road hazards & potholes', color: 'from-rose-400/20 to-orange-400/20', iconBg: 'bg-rose-500' },
        { icon: '💡', label: 'Streetlight', desc: 'Non-functional public lights', color: 'from-amber-400/20 to-yellow-400/20', iconBg: 'bg-amber-500' },
        { icon: '🗑️', label: 'Garbage', desc: 'Efficient waste collection', color: 'from-emerald-400/20 to-teal-400/20', iconBg: 'bg-emerald-500' },
        { icon: '💧', label: 'Water', desc: 'Leaks & supply disruptions', color: 'from-blue-400/20 to-cyan-400/20', iconBg: 'bg-blue-500' },
        { icon: '🌊', label: 'Drainage', desc: 'Blocked pipes & flooding', color: 'from-indigo-400/20 to-purple-400/20', iconBg: 'bg-indigo-500' },
        { icon: '🛣️', label: 'Road', desc: 'Maintenance & infrastructure', color: 'from-slate-400/20 to-slate-500/20', iconBg: 'bg-slate-600' },
    ]

    const steps = [
        { num: '01', title: 'Quick Catch', desc: 'Snap a photo and let our AI auto-fill the details and location.', icon: '📸' },
        { num: '02', title: 'Smart Route', desc: 'Your report is instantly categorized and routed to the right team.', icon: '🚀' },
        { num: '03', title: 'Live Update', desc: 'Follow progress in real-time with our transparent tracking system.', icon: '⏱️' },
        { num: '04', title: 'Fixed for Good', desc: 'Verification and resolution confirmation sent to your phone.', icon: '✨' },
    ]

    const liveStats = [
        { label: 'Total Intake', value: 10847 + counts.total, suffix: '', icon: '📊', color: 'emerald' },
        { label: 'Fixed Issues', value: 9623 + counts.resolved, suffix: '', icon: '✅', color: 'teal' },
        { label: 'Success Rate', value: 98, suffix: '%', icon: '💎', color: 'cyan' },
        { label: 'Response Time', value: 14, suffix: 'h', icon: '⚡', color: 'amber' },
    ]

    const faqs = [
        { q: 'How long until my issue is fixed?', a: 'High-priority safety issues are typically addressed within 24 hours. General maintenance requests average 3-5 days for resolution.' },
        { q: 'Can I track resolution anonymously?', a: 'Absolutely. Every submission generates a unique tracking ID that you can use without any account creation.' },
        { q: 'What happens after I submit a photo?', a: 'Our system analyzes the image to verify the issue, detects the exact GPS coordinates, and assigns it to the local municipal crew.' },
        { q: 'Is there a mobile app available?', a: 'Civic Pulse is a Progressive Web App (PWA). You can "Add to Home Screen" on your phone for a full app-like experience.' },
    ]

    return (
        <div className="min-h-screen relative overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900 bg-[#fdfdfd]">
            {/* ─── DYNAMIC BACKGROUND ─── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-400/10 blur-[120px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-400/10 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-400/5 blur-[100px] rounded-full animate-float-smooth" />
            </div>

            {/* ─── HERO SECTION ─── */}
            <section className="relative pt-32 pb-20 px-6 text-center overflow-visible">
                <div className="max-w-5xl mx-auto relative z-10">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100/50 shadow-sm mb-8 animate-slide-down">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] sm:text-xs font-bold text-emerald-700 uppercase tracking-widest">
                            New: Resolved 120+ issues this morning
                        </span>
                    </div>

                    <h1 className="font-display text-5xl md:text-8xl font-black text-slate-800 tracking-tight leading-[0.95] mb-8 animate-slide-up">
                        Your Town. <br />
                        <span className="text-shimmer italic">Perfected.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed animate-slide-up stagger-1 font-medium">
                        Civic Pulse connects you directly to city maintenance.
                        No queues, no paperwork—just fast resolutions for a better community.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up stagger-2 mb-20 relative z-20">
                        <Link
                            to="/citizen/submit"
                            className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 shadow-2xl shadow-slate-900/10 transition-all hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-3 group"
                        >
                            <span>Start a Report</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                        </Link>
                        <Link
                            to="/citizen/track"
                            className="w-full sm:w-auto px-10 py-5 glass rounded-2xl font-bold text-slate-700 hover:bg-white transition-all hover:scale-[1.03] active:scale-[0.98] border border-white/40"
                        >
                            Track Existing Issue
                        </Link>
                    </div>

                    {/* Trust / Logo Cloud */}
                    <div className="animate-fade-in stagger-3">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Trusted by Residents in 50+ Municipalities</p>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                            <span className="font-display text-xl font-black">CITYHUB</span>
                            <span className="font-display text-xl font-black tracking-tighter">METROCORE</span>
                            <span className="font-display text-xl font-black italic">URBANFLOW</span>
                            <span className="font-display text-xl font-black">CIVICON</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── LIVE DASHBOARD SECTION ─── */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="glass rounded-[2rem] p-1 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 aurora-bg opacity-30 group-hover:opacity-50 transition-opacity duration-1000" />
                        <div className="relative z-10 p-8 md:p-14 bg-white/40 rounded-[1.8rem] backdrop-blur-xl border border-white/20">
                            <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-16">
                                <div className="max-w-md text-left">
                                    <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 pulse-glow" />
                                        <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Live Pulse Dashboard</span>
                                    </div>
                                    <h2 className="font-display text-3xl md:text-5xl font-black text-slate-800 leading-[1.1] tracking-tighter">
                                        Real Impact. <br />Measured in Real-Time.
                                    </h2>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex -space-x-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-md group-hover:translate-y-[-4px] transition-transform" style={{ transitionDelay: `${i * 50}ms` }}>
                                                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="user" />
                                            </div>
                                        ))}
                                        <div className="w-10 h-10 rounded-full border-2 border-white bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md group-hover:translate-y-[-4px] transition-transform">+2k</div>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400">JOIN 10,000+ CONTRIBUTORS</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                {liveStats.map((stat, i) => (
                                    <div key={i} className="group/stat text-left">
                                        <div className="text-3xl mb-4 group-hover/stat:scale-110 group-hover/stat:rotate-6 transition-all duration-300 transform-gpu origin-left">
                                            {stat.icon}
                                        </div>
                                        <div className="font-display text-4xl md:text-5xl font-black text-slate-800 tracking-tighter mb-2">
                                            <Counter target={stat.value} suffix={stat.suffix} />
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest group-hover/stat:text-emerald-500 transition-colors">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CATEGORIES ─── */}
            <section className="py-24 px-6 relative">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20 animate-fade-in">
                        <h2 className="font-display text-4xl md:text-6xl font-black text-slate-800 mb-4 tracking-tighter">Everything matters.</h2>
                        <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">From potholes to streetlights, no issue is too small for a better city experience.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((cat, i) => (
                            <TiltCard key={i}>
                                <Link
                                    to="/citizen/submit"
                                    className={`block p-8 rounded-[2.5rem] bg-gradient-to-br ${cat.color} border border-white shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden h-full`}
                                >
                                    <div className="absolute -right-8 -bottom-8 text-9xl opacity-[0.03] group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-700">
                                        {cat.icon}
                                    </div>

                                    <div className={`w-14 h-14 ${cat.iconBg} rounded-[1.2rem] flex items-center justify-center text-2xl shadow-lg mb-6 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                                        {cat.icon}
                                    </div>

                                    <h3 className="font-display text-2xl font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">{cat.label}</h3>
                                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">{cat.desc}</p>

                                    <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-white/50 flex items-center justify-center translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-slate-800"><polyline points="9 18 15 12 9 6" /></svg>
                                    </div>
                                </Link>
                            </TiltCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── PROCESS ─── */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
                    <div className="absolute inset-0 aurora-bg opacity-10" />
                    <div className="relative z-10">
                        <div className="text-center mb-20">
                            <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter">Smooth as silk.</h2>
                            <p className="text-lg text-slate-400 max-w-xl mx-auto font-medium">A workflow built for the modern citizen.</p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            {steps.map((step, i) => (
                                <div key={i} className="relative group p-8 hover:bg-white/5 rounded-[2rem] transition-colors border border-transparent hover:border-white/10">
                                    <div className="font-display text-8xl font-black text-white/[0.03] absolute -top-4 -left-4 group-hover:text-emerald-500/[0.05] transition-colors pointer-events-none">
                                        {step.num}
                                    </div>
                                    <div className="text-4xl mb-6 transform group-hover:-rotate-12 transition-transform duration-500">
                                        {step.icon}
                                    </div>
                                    <h3 className="font-display text-xl font-bold text-white mb-3 tracking-tight">{step.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed font-medium">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── RECENT RESOLUTIONS ─── */}
            <section className="py-24 px-6 relative">
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-display text-4xl md:text-6xl font-black text-slate-800 mb-16 tracking-tighter text-center md:text-left">
                        Seeing is <span className="text-emerald-500">believing.</span>
                    </h2>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {[
                            { type: 'Road repair', location: 'Main Street', time: 'Yesterday', icon: '🛣️', color: 'slate' },
                            { type: 'Sanitation', location: 'West End', time: '4h ago', icon: '🗑️', color: 'emerald' },
                            { type: 'Lighting', location: 'Park Lane', time: 'Just now', icon: '💡', color: 'amber' },
                        ].map((item, i) => (
                            <div key={i} className="glass rounded-[2rem] p-8 shadow-sm flex items-center gap-6 border border-white group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-inner flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform">
                                    {item.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full">Resolved</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.time}</span>
                                    </div>
                                    <h4 className="font-bold text-slate-800 text-lg tracking-tight">{item.type}</h4>
                                    <p className="text-xs font-bold text-slate-400 tracking-wider">MUNICIPAL AREA &bull; {item.location}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FAQ ─── */}
            <section className="py-24 px-6 relative bg-emerald-50/20 rounded-[4rem] mx-4 mb-20 border border-emerald-100/30">
                <div className="max-w-3xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-6">
                            <span className="text-2xl">❓</span>
                        </div>
                        <h2 className="font-display text-4xl font-black text-slate-800 tracking-tighter mb-4">Got questions?</h2>
                        <p className="text-slate-500 font-medium">Everything you need to know about the Pulse workflow.</p>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <FAQItem
                                key={i}
                                q={faq.q}
                                a={faq.a}
                                open={faqOpen === i}
                                toggle={() => setFaqOpen(faqOpen === i ? null : i)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FINAL CTA ─── */}
            <section className="py-32 px-6 relative overflow-hidden bg-slate-900 mx-4 rounded-[4.5rem] mb-12">
                <div className="absolute inset-0 aurora-bg opacity-30" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/10 blur-[150px] rounded-full animate-pulse-slow pointer-events-none" />

                <div className="max-w-4xl mx-auto relative z-10 text-center">
                    <h2 className="font-display text-5xl md:text-8xl font-black text-white tracking-tight leading-[0.95] mb-8">
                        Ready to pulse? <br />
                        <span className="text-emerald-400 italic">Join the movement.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-xl mx-auto font-medium leading-relaxed">
                        The easiest way to care for your community. Start reporting issues in less than 30 seconds.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link to="/citizen/submit" className="w-full sm:w-auto px-12 py-6 bg-emerald-500 text-slate-900 rounded-2xl font-black text-xl hover:bg-emerald-400 shadow-2xl shadow-emerald-500/20 transition-all hover:scale-[1.05] active:scale-[0.98]">
                            Start Reporting
                        </Link>
                        <Link to="/auth" className="w-full sm:w-auto px-12 py-6 bg-white/5 backdrop-blur-md text-white rounded-2xl font-black text-xl hover:bg-white/10 transition-all border border-white/10">
                            Switch Role
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="py-16 px-6 text-center border-t border-slate-100">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="font-display text-2xl font-black text-slate-800 group cursor-default">
                        CIVIC<span className="text-emerald-500 transition-colors group-hover:text-emerald-600">PULSE</span>
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">
                        &copy; 2024 CIVIC PULSE &bull; REDEFINING GOVERNANCE
                    </p>
                    <div className="flex items-center gap-6">
                        <a href="#" className="text-slate-400 hover:text-emerald-500 transition-colors"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg></a>
                        <a href="#" className="text-slate-400 hover:text-emerald-500 transition-colors"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg></a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
