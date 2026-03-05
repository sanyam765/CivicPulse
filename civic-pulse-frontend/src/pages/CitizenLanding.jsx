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

export default function CitizenLanding() {
    const { switchToAdmin } = useRole()
    const [counts, setCounts] = useState({ total: 0, resolved: 0, pending: 0 })
    const [faqOpen, setFaqOpen] = useState(null)

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('complaints') || '[]')
        setCounts({
            total: stored.length,
            resolved: stored.filter(c => c.status === 'resolved').length,
            pending: stored.filter(c => c.status === 'pending' || c.status === 'in-progress').length
        })
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

    const pricingPlans = [
        { name: 'Basic', price: '$499', period: '/month', features: ['5 admin accounts', 'Email support', 'Basic reporting'], button: 'Get Started', outline: true },
        { name: 'Urban', price: '$1,299', period: '/month', features: ['20 admin accounts', '24/7 support', 'API access', 'Advanced analytics'], button: 'Choose Standard', popular: true },
        { name: 'Enterprise', price: 'Custom', features: ['Unlimited admin accounts', 'Dedicated account manager', 'Custom integration', 'On-site training'], button: 'Contact Sales', dark: true }
    ]

    return (
        <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900">
            {/* ─── HERO SECTION ─── */}
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
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                                </div>
                                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-12 bg-emerald-500/10 rounded-xl w-3/4" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-24 bg-slate-50 rounded-xl" />
                                    <div className="h-24 bg-slate-50 rounded-xl" />
                                </div>
                                <div className="h-8 bg-slate-50 rounded-xl w-1/2" />
                                <div className="h-2 bg-slate-100 rounded-full w-full" />
                                <div className="h-2 bg-slate-100 rounded-full w-2/3" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── FEATURES SECTION ─── */}
            <section className="py-24 px-6 bg-slate-50/50">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Features That Keep Your City Moving</h2>
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

            {/* ─── PROCESS SECTION ─── */}
            <section id="how-it-works" className="py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">A Streamlined 3-Step Process</h2>
                    <div className="grid md:grid-cols-3 gap-12 mt-20 relative">
                        {/* Connecting Line (Desktop) */}
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

            {/* ─── ADMIN SECTION ─── */}
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
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Empower Your Administrators</h2>
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
                        <button className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center gap-3 group">
                            Request Demo
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* ─── PRICING SECTION ─── */}
            <section id="pricing" className="py-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Transparent Plans for Every City</h2>
                    <p className="text-slate-500 mb-16">Select the right plan for your municipality's size.</p>

                    <div className="grid md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, i) => (
                            <div key={i} className={`relative p-8 rounded-[2.5rem] text-left transition-all hover:scale-[1.02] ${plan.popular ? 'border-2 border-emerald-500 bg-white shadow-2xl' :
                                    plan.dark ? 'bg-slate-900 text-white' : 'bg-white border border-slate-100 shadow-sm'
                                }`}>
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-8">
                                    <p className={`text-sm font-bold uppercase tracking-widest mb-2 ${plan.dark ? 'text-emerald-400' : 'text-slate-400'}`}>{plan.name}</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black">{plan.price}</span>
                                        {plan.period && <span className={`text-sm ${plan.dark ? 'text-slate-400' : 'text-slate-400'}`}>{plan.period}</span>}
                                    </div>
                                </div>
                                <ul className="space-y-4 mb-10">
                                    {plan.features.map((feat, j) => (
                                        <li key={j} className="flex items-center gap-3 text-sm font-medium">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500"><polyline points="20 6 9 17 4 12" /></svg>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-emerald-600 text-white hover:bg-emerald-700' :
                                        plan.dark ? 'bg-white text-slate-900 hover:bg-slate-100' :
                                            'bg-transparent border border-slate-200 text-slate-900 hover:bg-slate-50'
                                    }`}>
                                    {plan.button}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── FINAL CTA ─── */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto bg-emerald-700 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="relative z-10 text-white">
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
                            Build a More Responsive City <br className="hidden md:block" /> with Civic Pulse
                        </h2>
                        <Link to="/citizen/submit" className="inline-block px-10 py-5 bg-white text-emerald-700 rounded-xl font-bold text-lg hover:scale-105 transition-all shadow-2xl">
                            Get Started Today
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
                        <div className="col-span-2">
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
                        <div>
                            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Platform</h4>
                            <ul className="space-y-4 text-sm text-slate-500 font-medium">
                                <li><Link to="/" className="hover:text-emerald-500 transition-colors">Solutions</Link></li>
                                <li><Link to="/" className="hover:text-emerald-500 transition-colors">Features</Link></li>
                                <li><Link to="/" className="hover:text-emerald-500 transition-colors">Pricing</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Company</h4>
                            <ul className="space-y-4 text-sm text-slate-500 font-medium">
                                <li><Link to="/" className="hover:text-emerald-500 transition-colors">About Us</Link></li>
                                <li><Link to="/" className="hover:text-emerald-500 transition-colors">Case Studies</Link></li>
                                <li><Link to="/" className="hover:text-emerald-500 transition-colors">Careers</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Legal</h4>
                            <ul className="space-y-4 text-sm text-slate-500 font-medium">
                                <li><Link to="/" className="hover:text-emerald-500 transition-colors">Privacy Policy</Link></li>
                                <li><Link to="/" className="hover:text-emerald-500 transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                            &copy; 2024 Civic Pulse Inc. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer">
                                    <div className="w-4 h-4 bg-current rounded-sm" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
