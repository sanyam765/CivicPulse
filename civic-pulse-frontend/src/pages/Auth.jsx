import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRole } from '../context/RoleContext'
import { register as registerService, login as loginService } from '../services/authService'

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)
    const [focusedField, setFocusedField] = useState(null)
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [confirmPassword, setConfirmPassword] = useState('')
    const [pwTouched, setPwTouched] = useState(false)

    const navigate = useNavigate()
    const { login } = useRole()

    const passwordRules = [
        { id: 'length',  label: 'At least 8 characters',          test: p => p.length >= 8 },
        { id: 'noSpace', label: 'No spaces allowed',               test: p => !/\s/.test(p) },
        { id: 'upper',   label: 'One uppercase letter (A–Z)',       test: p => /[A-Z]/.test(p) },
        { id: 'lower',   label: 'One lowercase letter (a–z)',       test: p => /[a-z]/.test(p) },
        { id: 'number',  label: 'One number (0–9)',                 test: p => /\d/.test(p) },
        { id: 'special', label: 'One special character (!@#$…)',    test: p => /[^A-Za-z0-9]/.test(p) },
    ]

    const passedRules = passwordRules.filter(r => r.test(password))
    const allRulesPassed = passedRules.length === passwordRules.length

    const getStrength = () => {
        const n = passedRules.length
        if (n <= 1) return { label: 'Very Weak', color: '#ef4444', segments: 1 }
        if (n <= 3) return { label: 'Weak',      color: '#f97316', segments: 2 }
        if (n <= 4) return { label: 'Fair',       color: '#eab308', segments: 3 }
        if (n === 5) return { label: 'Strong',    color: '#22c55e', segments: 4 }
        return              { label: 'Very Strong', color: '#10b981', segments: 5 }
    }
    const strength = getStrength()

    const handleAuth = async (e) => {
        e.preventDefault()
        setError('')

        if (isLogin) {
            setLoading(true)
            try {
                const response = await loginService({ email, password })
                const { user, token } = response.data
                login(user, user.role, token)
                navigate(user.role === 'admin' ? '/' : '/citizen')
            } catch (err) {
                setError(err.message || 'Login failed')
            } finally {
                setLoading(false)
            }
            return
        }
        if (!allRulesPassed) {
            const failed = passwordRules.find(r => !r.test(password))
            setError(`Password requirement not met: ${failed.label}.`)
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)
        try {
            const response = await registerService({
                name: name.trim(),
                email: email.toLowerCase(),
                password,
                role: 'citizen'
            })
            const { user, token } = response.data
            login(user, user.role, token)
            navigate('/citizen')
        } catch (err) {
            setError(err.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
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

            <div className="hidden lg:flex lg:w-[48%] xl:w-[52%] relative flex-col p-14 overflow-hidden"
                style={{ background: '#0f172a' }}>

                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 aurora-bg opacity-20" />
                    <div className="absolute inset-0 opacity-20"
                        style={{ backgroundImage: 'linear-gradient(rgba(16,185,129,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.07) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                    <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[100px] opacity-30"
                        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.5), transparent 70%)', animation: 'float 22s ease-in-out infinite' }} />
                    <div className="absolute -bottom-40 -right-20 w-[400px] h-[400px] rounded-full blur-[80px] opacity-20"
                        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.4), transparent 70%)', animation: 'float 28s ease-in-out 6s infinite' }} />
                </div>

                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

                <div className="relative z-10 flex flex-col h-full">

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

            <div className="flex-1 flex items-center justify-center p-8 lg:p-14 relative"
                style={{ background: 'linear-gradient(160deg, #f8fffe 0%, #f0fdfa 50%, #ecfdf5 100%)' }}>

                <div className="lg:hidden absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-[80px] opacity-30"
                        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.35), transparent)' }} />
                    <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full blur-[60px] opacity-20"
                        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.3), transparent)' }} />
                </div>

                <div className="w-full max-w-[420px] relative z-10">

                    <div className="flex lg:hidden items-center gap-2.5 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                        </div>
                        <span className="font-display text-2xl font-black tracking-tight text-slate-800">
                            Civic<span className="gradient-text">Pulse</span>
                        </span>
                    </div>

                    <div className="mb-8">
                        <h2 className="font-display text-3xl font-black text-slate-900 tracking-tight mb-1.5">
                            {isLogin ? 'Welcome back 👋' : 'Create account'}
                        </h2>
                        <p className="text-sm text-slate-400 font-medium">
                            {isLogin ? 'Sign in to your account' : 'Join CivicPulse and start making a difference'}
                        </p>
                    </div>

                    <div className="rounded-3xl p-8 border border-white/60"
                        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(40px)', boxShadow: '0 20px 60px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.03)' }}>

                        {error && (
                            <div className="flex items-start gap-2.5 mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                <p className="text-xs font-semibold text-red-600 leading-snug">{error}</p>
                            </div>
                        )}

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
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                                    {isLogin && (
                                        <Link to="/forgot-password" className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={e => { setPassword(e.target.value); setPwTouched(true) }}
                                        onFocus={() => setFocusedField('pass')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Create a strong password"
                                        className={inputClass('pass') + ' pr-12'}
                                    />
                                    <button type="button" onClick={() => setShowPassword(v => !v)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                        {showPassword ? (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                        ) : (
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                        )}
                                    </button>
                                </div>

                                {!isLogin && pwTouched && password.length > 0 && (
                                    <div className="mt-3 space-y-2.5">

                                        <div className="flex items-center gap-2">
                                            <div className="flex gap-1 flex-1">
                                                {[1,2,3,4,5].map(i => (
                                                    <div key={i} className="h-1.5 flex-1 rounded-full transition-all duration-300"
                                                        style={{ background: i <= strength.segments ? strength.color : '#e2e8f0' }} />
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: strength.color }}>{strength.label}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1">
                                            {passwordRules.map(rule => {
                                                const passed = rule.test(password)
                                                return (
                                                    <div key={rule.id} className="flex items-center gap-1.5">
                                                        <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                                                            passed ? 'bg-emerald-500' : 'bg-slate-200'
                                                        }`}>
                                                            {passed && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>}
                                                        </div>
                                                        <span className={`text-[10px] font-semibold leading-tight transition-colors duration-200 ${
                                                            passed ? 'text-emerald-600' : 'text-slate-400'
                                                        }`}>{rule.label}</span>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type={showConfirm ? 'text' : 'password'}
                                            required
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            onFocus={() => setFocusedField('confirm')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Re-enter your password"
                                            className={`${inputClass('confirm')} pr-12 ${
                                                confirmPassword && password !== confirmPassword
                                                    ? '!border-red-300 !shadow-[0_0_0_4px_rgba(239,68,68,0.08)]'
                                                    : confirmPassword && password === confirmPassword
                                                    ? '!border-emerald-400'
                                                    : ''
                                            }`}
                                        />
                                        <button type="button" onClick={() => setShowConfirm(v => !v)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                            {showConfirm ? (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            )}
                                        </button>

                                        {confirmPassword && (
                                            <div className={`absolute right-11 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center ${
                                                password === confirmPassword ? 'bg-emerald-500' : 'bg-red-400'
                                            }`}>
                                                {password === confirmPassword
                                                    ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><polyline points="20 6 9 17 4 12"/></svg>
                                                    : <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                                }
                                            </div>
                                        )}
                                    </div>
                                    {confirmPassword && password !== confirmPassword && (
                                        <p className="text-[10px] font-semibold text-red-500 mt-1.5 ml-1">Passwords do not match</p>
                                    )}
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
                            <button onClick={() => { setIsLogin(!isLogin); setError(''); setPassword(''); setConfirmPassword(''); setPwTouched(false); setShowPassword(false); setShowConfirm(false) }} className="text-emerald-600 font-black hover:text-emerald-700 transition-colors">
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
