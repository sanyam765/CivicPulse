import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useRole } from '../../context/RoleContext'

export default function CitizenNavbar() {
    const { switchToAdmin, logout, user } = useRole()
    const location = useLocation()
    const navigate = useNavigate()
    const [scrolled, setScrolled] = useState(false)
    const [scrollProgress, setScrollProgress] = useState(0)
    const [menuOpen, setMenuOpen] = useState(false)
    const [userMenuOpen, setUserMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 30)
            const totalH = document.documentElement.scrollHeight - window.innerHeight
            setScrollProgress(totalH > 0 ? (window.scrollY / totalH) * 100 : 0)
        }
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const navLinks = [
        { label: 'Home', path: '/citizen', icon: '🏠' },
        { label: 'Submit', path: '/citizen/submit', icon: '📝' },
        { label: 'My Complaints', path: '/citizen/my-complaints', icon: '📋' },
        { label: 'Track', path: '/citizen/track', icon: '🔍' },
    ]

    const isActive = (path) => {
        if (path === '/citizen') return location.pathname === '/citizen' || location.pathname === '/'
        return location.pathname.startsWith(path)
    }

    const handleLogout = () => { logout(); navigate('/login') }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-150 pointer-events-none"
                style={{
                    width: `${scrollProgress}%`,
                    background: 'linear-gradient(90deg, #10b981, #14b8a6, #06b6d4)',
                    opacity: scrolled ? 1 : 0,
                }} />

            {/* Background */}
            {scrolled && (
                <div className="absolute inset-0 glass-nav" />
            )}

            <div className="relative max-w-7xl mx-auto px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/citizen" className="flex items-center gap-2.5 group">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg transition-shadow group-hover:shadow-glow"
                            style={{ boxShadow: '0 4px 16px rgba(16,185,129,0.25)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                            </svg>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 pointer-events-none">
                            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-orbit" />
                        </div>
                    </div>
                    <span className="font-display text-xl font-extrabold tracking-tight">
                        <span className="text-slate-800 group-hover:text-slate-900 transition-colors">Civic</span>
                        <span className="gradient-text">Pulse</span>
                    </span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded-2xl border border-white/50 bg-white/40 backdrop-blur-sm">
                    {navLinks.map((link) => {
                        const active = isActive(link.path)
                        return (
                            <Link key={link.path} to={link.path}
                                className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${active
                                    ? 'bg-white text-emerald-700 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/60'}`}>
                                {link.label}
                                {active && (
                                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
                                )}
                            </Link>
                        )
                    })}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2.5">
                    {/* Admin switch */}
                    <button onClick={switchToAdmin}
                        className="group hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 hover:bg-white/50 transition-all">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            className="group-hover:rotate-90 transition-transform duration-500">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        Admin
                    </button>

                    {/* User dropdown */}
                    <div className="relative hidden md:block">
                        <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className="flex items-center gap-2 p-1.5 pr-3 rounded-2xl border border-white/50 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all">
                            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-white font-black text-xs shadow-sm">
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span className="text-xs font-bold text-slate-700">{user?.name?.split(' ')[0] || 'User'}</span>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                                className={`text-slate-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`}>
                                <path d="M6 9l6 6 6-6" />
                            </svg>
                        </button>

                        {userMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                                <div className="absolute right-0 mt-2 w-52 rounded-2xl shadow-elevated border border-white/50 p-2 z-20 animate-scale-in origin-top-right"
                                    style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(40px)' }}>
                                    <div className="px-3 py-2.5 mb-1">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Signed in as</p>
                                        <p className="text-sm font-bold text-slate-800 mt-0.5 truncate">{user?.name || 'Citizen'}</p>
                                        <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
                                    </div>
                                    <div className="h-px bg-slate-100 mb-1 mx-2" />
                                    <Link to="/citizen/my-complaints" onClick={() => setUserMenuOpen(false)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all">
                                        <span>📋</span> My Complaints
                                    </Link>
                                    <button onClick={() => { switchToAdmin(); setUserMenuOpen(false) }}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-all text-left">
                                        <span>🛡️</span> Admin Panel
                                    </button>
                                    <div className="h-px bg-slate-100 my-1 mx-2" />
                                    <button onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all text-left">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Report CTA */}
                    <Link to="/citizen/submit"
                        className="hidden sm:flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 overflow-hidden relative"
                        style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)', boxShadow: '0 4px 16px rgba(16,185,129,0.25)' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                        Report Issue
                    </Link>

                    {/* Mobile Menu Button */}
                    <button onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2.5 rounded-xl border border-white/40 bg-white/50 backdrop-blur-sm">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-600">
                            {menuOpen
                                ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
                                : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden mx-4 mt-2 rounded-2xl shadow-elevated border border-white/50 p-3 animate-slide-up"
                    style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(40px)' }}>
                    {navLinks.map((link) => (
                        <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive(link.path) ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-white/60'}`}>
                            <span>{link.icon}</span>{link.label}
                        </Link>
                    ))}
                    <div className="h-px bg-slate-100 my-2" />
                    <div className="flex gap-2">
                        <button onClick={() => { switchToAdmin(); setMenuOpen(false) }} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-white/60 text-center">🛡️ Admin</button>
                        <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 text-center">Sign Out</button>
                    </div>
                </div>
            )}
        </nav>
    )
}
