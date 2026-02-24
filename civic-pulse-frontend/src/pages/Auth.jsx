import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useRole } from '../context/RoleContext'

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)
    const [authRole, setAuthRole] = useState('citizen') // 'citizen' or 'admin'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()
    const { login } = useRole()

    const handleAuth = (e) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        setTimeout(() => {
            setLoading(false)
            const mockUser = {
                name: authRole === 'admin' ? 'Super Admin' : 'John Citizen',
                email: email,
                id: Math.random().toString(36).substr(2, 9)
            }

            login(mockUser, authRole)
            navigate(authRole === 'admin' ? '/' : '/citizen')
        }, 1500)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            {/* Aurora Background Orbs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-500/10 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            <div className="w-full max-w-[440px] relative z-10">
                {/* Logo */}
                <div className="flex justify-center mb-8 animate-fade-in">
                    <div className="flex items-center gap-2.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 glow-breathe">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </div>
                        <span className="font-display text-3xl font-black tracking-tight text-slate-800">
                            Civic<span className="gradient-text">Pulse</span>
                        </span>
                    </div>
                </div>

                {/* Auth Card */}
                <div className="glass rounded-[32px] shadow-float p-8 md:p-10 modal-elastic-in">
                    {/* Role Toggle */}
                    <div className="flex p-1 bg-slate-100/50 backdrop-blur-md rounded-2xl mb-8">
                        <button
                            onClick={() => setAuthRole('citizen')}
                            type="button"
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${authRole === 'citizen' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Citizen
                        </button>
                        <button
                            onClick={() => setAuthRole('admin')}
                            type="button"
                            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${authRole === 'admin' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Administrator
                        </button>
                    </div>

                    <div className="mb-8">
                        <h2 className="font-display text-2xl font-extrabold text-slate-800 mb-2">
                            {isLogin ? 'Welcome Back' : 'Join CivicPulse'}
                        </h2>
                        <p className="text-sm text-slate-400 font-medium">
                            {isLogin
                                ? `Log in to manage your civic ${authRole === 'admin' ? 'operations' : 'reports'}`
                                : 'Create an account to start contributing to your city'}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full px-5 py-4 bg-white/60 border-2 border-slate-200/60 rounded-2xl text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:border-emerald-400 focus:outline-none focus:bg-white transition-all transition-duration-300 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-5 py-4 bg-white/60 border-2 border-slate-200/60 rounded-2xl text-sm font-semibold text-slate-700 placeholder:text-slate-300 focus:border-emerald-400 focus:outline-none focus:bg-white transition-all transition-duration-300 shadow-sm"
                            />
                        </div>

                        {isLogin && (
                            <div className="flex justify-end">
                                <button type="button" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 transform transition-all duration-300 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-400 font-medium">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors"
                            >
                                {isLogin ? 'Sign Up' : 'Log In'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Footer info */}
                <p className="mt-8 text-center text-slate-400 text-xs font-medium">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    )
}
