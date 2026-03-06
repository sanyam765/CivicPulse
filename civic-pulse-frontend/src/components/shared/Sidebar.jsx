import React, { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useRole } from '../../context/RoleContext'

const navItems = [
  {
    id: 'dashboard', label: 'Dashboard', path: '/',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>,
  },
  {
    id: 'complaints', label: 'Complaints', path: '/complaints', badge: 24,
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  },
  {
    id: 'map', label: 'City Map', path: '/map',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>,
  },
  {
    id: 'analytics', label: 'Analytics', path: '/analytics',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
  },
  {
    id: 'timeline', label: 'Timeline', path: '/timeline',
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  },
]

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { switchToCitizen, logout, user } = useRole()

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside
      className="fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-500"
      style={{
        width: collapsed ? '78px' : '260px',
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(32px) saturate(190%)',
        WebkitBackdropFilter: 'blur(32px) saturate(190%)',
        borderRight: '1px solid rgba(255,255,255,0.3)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.04), 8px 0 48px rgba(0,0,0,0.02)',
      }}>

      {/* Top rim light */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />

      {/* LOGO */}
      <div className={`px-5 py-5 flex items-center gap-3 border-b border-white/20 ${collapsed ? 'justify-center' : ''}`}>
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg"
            style={{ boxShadow: '0 4px 16px rgba(16,185,129,0.25)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-orbit" />
          </div>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-display font-extrabold text-lg text-slate-800 leading-tight tracking-tight whitespace-nowrap">
              Civic<span className="gradient-text">Pulse</span>
            </h1>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">Admin Panel</p>
          </div>
        )}
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'none' }}>
        {!collapsed && (
          <p className="px-3 mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Main Menu</p>
        )}
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <button key={item.id}
              onClick={() => navigate(item.path)}
              title={collapsed ? item.label : undefined}
              className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${collapsed ? 'justify-center' : ''} ${active
                ? 'bg-emerald-50/90 text-emerald-700 shadow-sm'
                : 'text-slate-500 hover:bg-white/60 hover:text-slate-700 hover:shadow-sm'}`}>

              {/* Active indicator */}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-gradient-to-b from-emerald-400 to-teal-400 shadow-sm" />
              )}

              {/* Icon */}
              <div className={`flex-shrink-0 transition-colors duration-300 ${active ? 'text-emerald-600' : 'text-slate-400 group-hover:text-emerald-500'}`}>
                {item.icon}
              </div>

              {/* Label */}
              {!collapsed && (
                <span className="text-sm font-semibold whitespace-nowrap flex-1 text-left">{item.label}</span>
              )}

              {/* Badge */}
              {item.badge && !collapsed && (
                <span className="ml-auto flex-shrink-0 min-w-[1.4rem] h-[1.4rem] px-1.5 text-[10px] font-black rounded-full text-white bg-amber-500 flex items-center justify-center shadow-sm">
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}

        {/* New Report CTA */}
        <button onClick={() => navigate('/submit')} title={collapsed ? 'New Report' : undefined}
          className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mt-3 text-white font-semibold transition-all hover:-translate-y-0.5 overflow-hidden ${collapsed ? 'justify-center' : ''}`}
          style={{ background: 'linear-gradient(135deg, #10b981, #14b8a6)', boxShadow: '0 4px 16px rgba(16,185,129,0.25)' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className="flex-shrink-0 group-hover:rotate-90 transition-transform duration-300">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          {!collapsed && <span className="text-sm z-10 relative whitespace-nowrap">New Report</span>}
        </button>
      </nav>

      {/* BOTTOM */}
      <div className="px-3 py-3 border-t border-white/20 space-y-0.5">
        {!collapsed && <p className="px-3 mb-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Account</p>}

        <button onClick={switchToCitizen} title={collapsed ? 'Citizen View' : undefined}
          className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-slate-400 hover:bg-emerald-50/60 hover:text-emerald-600 text-sm font-semibold ${collapsed ? 'justify-center' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 group-hover:text-emerald-500 transition-colors">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          {!collapsed && 'Citizen View'}
        </button>

        <button onClick={() => navigate('/settings')} title={collapsed ? 'Settings' : undefined}
          className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-slate-400 hover:bg-white/60 hover:text-slate-600 text-sm font-semibold ${collapsed ? 'justify-center' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 group-hover:text-emerald-500 transition-colors group-hover:rotate-90 duration-300">
            <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          {!collapsed && 'Settings'}
        </button>

        <button onClick={handleLogout} title={collapsed ? 'Sign Out' : undefined}
          className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-slate-400 hover:bg-red-50/60 hover:text-red-500 text-sm font-semibold ${collapsed ? 'justify-center' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 group-hover:text-red-400 transition-colors">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!collapsed && 'Sign Out'}
        </button>

        {/* User card */}
        <div className={`mt-3 rounded-xl py-3 px-3 flex items-center gap-2.5 cursor-default transition-all ${collapsed ? 'justify-center' : ''}`}
          style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.5)' }}>
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center text-white font-black text-sm shadow-md">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white" style={{ boxShadow: '0 0 6px rgba(16,185,129,0.5)' }} />
          </div>
          {!collapsed && (
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-700 truncate">{user?.name || 'Admin'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@civicpulse.io'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse toggle */}
      <button onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-20 w-7 h-7 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-200 transition-all z-50">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
          className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </aside>
  )
}
