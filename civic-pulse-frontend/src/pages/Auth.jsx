import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRole } from '../context/RoleContext'

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)
    const [authRole, setAuthRole] = useState('citizen')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [focusedField, setFocusedField] = useState(null)

    const navigate = useNavigate()
    const { login } = useRole()

    const handleAuth = (e) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            const mockUser = {
                name: name || (authRole === 'admin' ? 'Super Admin' : 'John Citizen'),
                email: email,
                id: Math.random().toString(36).substr(2, 9)
            }
            login(mockUser, authRole)
            navigate(authRole === 'admin' ? '/' : '/citizen')
        }, 1400)
    }

    const features = [
        { icon: '⚡', text: 'Issues resolved in under 24 hours' },
        { icon: '📍', text: 'GPS-accurate location detection' },
        { icon: '🔔', text: 'Real-time progress notifications' },
        { icon: '🔒', text: 'Privacy-first, anonymous reporting' },
    ]

    const stats = [
        { value: '10K+', label: 'Active Users' },
        { value: '98%', label: 'Resolution Rate' },
        { value: '50+', label: 'Municipalities' },
    ]

    const inputClass = (field) =>
        `w-full px-5 py-3.5 rounded-2xl text-sm font-semibold text-slate-700 placeholder:text-slate-300 transition-all duration-300 outline-none border-2 ${focusedField === field
            ? 'border-emerald-400 bg-white shadow-[0_0_0_4px_rgba(16,185,129,0.12)]'
            : 'border-slate-200/80 bg-white/70 hover:border-slate-300'}`

    return (
        <div className="min-h-screen flex overflow-hidden">

            {/* ════ LEFT PANEL ════ */}
            <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative flex-col p-14 overflow-hidden"
                style={{ background: '#0f172a' }}>
                {/* Animated bg blobs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 aurora-bg opacity-20" />
                    <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.07) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[100px] opacity-30"
                        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.5), transparent 70%)', animation: 'float 22s ease-in-out infinite' }} />
                    <div className="absolute -bottom-40 -right-20 w-[400px] h-[400px] rounded-full blur-[80px] opacity-20"
                        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4), transparent 70%)', animation: 'float 28s ease-in-out 6s infinite' }} />
                </div>
                {/* Top rim */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg"
                            style={{ boxShadow: '0 0 20px rgba(16,185,129,0.4)' }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </div>
                        <span className="font-display text-2xl font-black text-white tracking-tight">
                            Civic<span style={{ background: 'linear-gradient(135deg,#10b981,#34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Pulse</span>
                        </span>
                    </div>

                    {/* Copy */}
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="mb-3">
                            <span className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em]">Smart Civic Platform</span>
                        </div>
                        <h1 className="font-display text-5xl xl:text-[60px] font-black text-white leading-[0.95] tracking-tighter mb-8">
                            Your city,<br />
                            <em style={{ background: 'linear-gradient(135deg,#10b981,#34d399,#14b8a6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                                better every day.
                            </em>
                        </h1>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12 max-w-sm">
                            Join thousands of citizens actively shaping the future of their communities through real, transparent action.
                        </p>
                        <div className="space-y-3 mb-14">
                            {features.map((f, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm font-medium text-white/75">
                                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                                        style={{ background: 'rgba(255,255,255,0.07)' }}>
                                        {f.icon}
                                    </div>
                                    {f.text}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-8">
                            {stats.map((s, i) => (
                                <div key={i} className={i > 0 ? 'pl-8 border-l border-white/10' : ''}>
                                    <p className="font-display text-3xl font-black text-white">{s.value}</p>
                                    <p className="text-xs font-medium text-slate-500">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Floating UI badges */}
                    {[
                        { icon: '✅', label: 'Road fixed in 4h', top: '28%', right: '-4%', color: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.25)', text: 'rgba(16,185,129,0.9)', delay: '0s', dur: '5s' },
                        { icon: '⚡', label: '3 issues nearby', bottom: '33%', right: '6%', color: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', text: 'rgba(245,158,11,0.9)', delay: '2s', dur: '6s' },
                        { icon: '🔔', label: 'Update: In Progress', top: '50%', right: '-2%', color: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', text: 'rgba(147,197,253,0.9)', delay: '1s', dur: '7s' },
                    ].map((b, i) => (
                        <div key={i} className="absolute flex items-center gap-2 px-4 py-2.5 rounded-2xl"
                            style={{
                                top: b.top || 'auto', bottom: b.bottom || 'auto', right: b.right || 'auto',
                                background: b.color, border: `1px solid ${b.border}`, color: b.text,
                                backdropFilter: 'blur(16px)', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                                animation: `float ${b.dur} ease-in-out ${b.delay} infinite`,
                            }}>
                            <span className="text-base">{b.icon}</span>
                            {b.label}
                        </div>
                    ))}

                    <p className="text-slate-700 text-xs font-medium">© 2024 CivicPulse · Redefining Civic Governance</p>
                </div>
            </div>

            {/* ════ RIGHT PANEL ════ */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-14 relative"
                style={{ background: 'linear-gradient(160deg, #f8fffe 0%, #f0fdfa 50%, #ecfdf5 100%)' }}>
                {/* BG blobs mobile */}
                <div className="lg:hidden absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-[80px] opacity-30"
                        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.35), transparent)' }} />
                    <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-[60px] opacity-20"
                        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.3), transparent)' }} />
                </div>

                <div className="w-full max-w-[420px] relative z-10">
                    {/* Mobile Logo */}
                    <div className="flex lg:hidden items-center gap-2.5 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                        </div>
                        <span className="font-display text-2xl font-black tracking-tight text-slate-800">
                            Civic<span className="gradient-text">Pulse</span>
                        </span>
                    </div>

                    {/* Heading */}
                    <div className="mb-8">
                        <h2 className="font-display text-3xl font-black text-slate-900 tracking-tight mb-1.5">
                            {isLogin ? 'Welcome back 👋' : 'Create account'}
                        </h2>
                        <p className="text-sm text-slate-400 font-medium">
                            {isLogin ? `Sign in to your ${authRole} account` : 'Join CivicPulse and start making a difference'}
                        </p>
                    </div>

                    {/* Form card */}
                    <div className="rounded-3xl p-8 border border-white/60"
                        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(40px)', boxShadow: '0 20px 60px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.03)' }}>
                        {/* Role toggle */}
                        <div className="flex p-1 bg-slate-100/80 rounded-2xl mb-6">
                            {[{ id: 'citizen', label: '👤 Citizen' }, { id: 'admin', label: '🛡️ Admin' }].map(r => (
                                <button key={r.id} onClick={() => setAuthRole(r.id)} type="button"
                                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-300 ${authRole === r.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                                    {r.label}
                                </button>
                            ))}
                        </div>

                        <form onSubmit={handleAuth} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Full Name</label>
                                    <input type="text" required value={name} onChange={e => setName(e.target.value)}
                                        onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                                        placeholder="Your full name" className={inputClass('name')} />
                                </div>
                            )}
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Email Address</label>
                                <div className="relative">
                                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                        onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                                        placeholder="name@example.com" className={inputClass('email')} />
                                    {email && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Password</label>
                                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                                    onFocus={() => setFocusedField('pass')} onBlur={() => setFocusedField(null)}
                                    placeholder="••••••••" className={inputClass('pass')} />
                            </div>
                            {isLogin && (
                                <div className="flex justify-end -mt-1">
                                    <button type="button" className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors">Forgot password?</button>
                                </div>
                            )}
                            <button type="submit" disabled={loading}
                                className="relative w-full py-4 text-slate-900 rounded-2xl font-black text-sm overflow-hidden transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', boxShadow: '0 10px 30px rgba(16,185,129,0.28)' }}>
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><polyline points="9 18 15 12 9 6" /></svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="flex items-center gap-3 my-5">
                            <div className="flex-1 h-px bg-slate-100" />
                            <span className="text-xs font-bold text-slate-300">or</span>
                            <div className="flex-1 h-px bg-slate-100" />
                        </div>

                        <p className="text-center text-sm text-slate-400 font-medium">
                            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                            <button onClick={() => setIsLogin(!isLogin)} className="text-emerald-600 font-black hover:text-emerald-700 transition-colors">
                                {isLogin ? 'Sign Up' : 'Log In'}
                            </button>
                        </p>
                    </div>

                    <p className="mt-5 text-center text-slate-400 text-xs font-medium leading-relaxed">
                        By continuing, you agree to our{' '}
                        <span className="text-emerald-600 cursor-pointer hover:underline">Terms</span>
                        {' '}and{' '}
                        <span className="text-emerald-600 cursor-pointer hover:underline">Privacy Policy</span>.
                    </p>
                </div>
            </div>
        </div>
    )
}
