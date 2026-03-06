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

    const testimonials = [
        { name: 'Sarah Jenkins', role: 'Local Business Owner', quote: 'I reported a streetlight outage in front of my shop, and it was fixed the very next day. This app has made our block safer.', avatar: 'https://i.pravatar.cc/150?img=32' },
        { name: 'Michael Chen', role: 'Daily Commuter', quote: 'The pothole reporting is incredibly accurate. I uploaded a photo, the AI tagged the location, and I got a text when the crew filled it.', avatar: 'https://i.pravatar.cc/150?img=11' },
        { name: 'Elena Rodriguez', role: 'Community Organizer', quote: 'CivicPulse feels like we finally have a direct line to city hall. The transparency in tracking the resolution progress is a game changer.', avatar: 'https://i.pravatar.cc/150?img=47' }
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
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Resident Issue Dashboard</span>
                        </div>
                        <h1 className="text-6xl md:text-[5.5rem] font-black text-[#0f172a] leading-[1.05] tracking-tight mb-6">
                            A Smarter Way to <br />
                            <span className="text-[#10b981] italic font-medium tracking-normal pr-1">Manage</span> Civic <br />
                            Issues
                        </h1>
                        <p className="text-lg text-slate-500 mb-10 max-w-xl leading-relaxed">
                            Bridge the gap between citizens and administration. Our platform streamlines complaint reporting, department routing, and resource tracking in one unified interface.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/citizen/submit" className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2">
                                Report an Issue
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                            </Link>
                            <Link to="/citizen/track" className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all">
                                View Dashboard
                            </Link>
                        </div>
                        <div className="mt-12 flex items-center gap-8 border-t border-slate-100 pt-8">
                            <div>
                                <p className="text-2xl font-bold text-slate-900">10,847</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Reports</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">9,623</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Fixed Issues</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-slate-900">14h</p>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avg Response</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-emerald-400/10 blur-[100px] rounded-full sm:block hidden" />
                        <div className="relative glass rounded-3xl p-6 shadow-2xl border border-white/50">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-200 hover:bg-red-400 transition-colors cursor-pointer" />
                                    <div className="w-3 h-3 rounded-full bg-slate-200 hover:bg-amber-400 transition-colors cursor-pointer" />
                                    <div className="w-3 h-3 rounded-full bg-slate-200 hover:bg-emerald-400 transition-colors cursor-pointer" />
                                </div>
                                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    AI processing
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="w-full h-36 rounded-xl bg-slate-100 overflow-hidden relative group">
                                    <img src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Pothole" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                                    {/* Scanning line animation */}
                                    <div className="absolute top-0 bottom-0 w-[2px] bg-emerald-400 shadow-[0_0_15px_3px_#34d399] animate-[pulse_1s_infinite] left-[0%] transition-all duration-[3000ms] ease-linear overflow-hidden" style={{ animation: 'scan 3s infinite linear alternate' }} />

                                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                            <span className="text-[10px] text-white font-bold drop-shadow-md">Detected: 5th Ave & Main</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Analysis Result</span>
                                        <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">98% Match</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded-md text-[10px] font-bold uppercase tracking-wider border border-rose-200 shadow-sm">Hazard: Pothole</span>
                                        <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold uppercase tracking-wider border border-amber-200 shadow-sm">Priority: High</span>
                                        <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold uppercase tracking-wider border border-blue-200 shadow-sm">Dept: Public Works</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <span>Confidence Score</span>
                                        <span>Auto-Routing...</span>
                                    </div>
                                </div>
                            </div>
                            <style>{`
                                @keyframes scan {
                                    0% { left: 0%; }
                                    100% { left: 100%; }
                                }
                            `}</style>
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

            {/* ─── PROCESS SECTION ─── */}
            <section id="how-it-works" className="py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center">A Streamlined 3-Step Process</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto text-center mb-16">
                        From identifying a local problem to seeing it resolved, Civic Pulse connects you directly to the teams that can fix it.
                    </p>

                    <div className="max-w-5xl mx-auto relative pt-4">
                        {/* Connecting Line (Desktop) */}
                        <div className="absolute top-[3.25rem] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-emerald-100 via-emerald-400/50 to-emerald-100 hidden md:block" />

                        <div className="grid md:grid-cols-3 gap-8 relative z-10">
                            {processSteps.map((step, i) => (
                                <div key={i} className="flex flex-col flex-1 group">
                                    <div className="w-full flex justify-center mb-8 relative">
                                        <div className="absolute inset-0 bg-emerald-50 rounded-full scale-0 group-hover:scale-[2] transition-transform duration-700 ease-out opacity-0 group-hover:opacity-50" />
                                        <div className="w-20 h-20 bg-white rounded-full border-[3px] border-emerald-100 flex items-center justify-center shadow-lg relative group-hover:border-emerald-400 group-hover:scale-110 transition-all duration-300">
                                            <span className="text-2xl font-black text-emerald-600 font-display group-hover:text-emerald-500 transition-colors">0{step.num}</span>
                                        </div>
                                    </div>
                                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300 flex-1 flex flex-col justify-center">
                                        <div className="absolute -right-6 -top-6 text-[120px] font-black text-slate-50/60 pointer-events-none transition-colors duration-500 group-hover:text-emerald-50/50">
                                            {step.num}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4 relative z-10 group-hover:text-emerald-700 transition-colors">{step.title}</h3>
                                        <p className="text-sm text-slate-500 leading-relaxed relative z-10">
                                            {step.desc}
                                        </p>
                                    </div>
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

            {/* ─── TESTIMONIALS SECTION ─── */}
            <section className="py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Real Impact in Your Neighborhood</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Hear from citizens who are already helping to improve our city infrastructure every day.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, i) => (
                            <div key={i} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                                <div className="text-emerald-500 mb-6">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                                </div>
                                <p className="text-slate-700 italic leading-relaxed mb-8">"{testimonial.quote}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200">
                                        <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
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