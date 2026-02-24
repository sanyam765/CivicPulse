import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useRole } from '../../context/RoleContext'

const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'complaints',
    label: 'Complaints',
    path: '/complaints',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
    badge: 24,
  },
  {
    id: 'map',
    label: 'Map View',
    path: '/map',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    id: 'timeline',
    label: 'Timeline',
    path: '/timeline',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: '/analytics',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    id: 'submit',
    label: 'Submit New',
    path: '/submit',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
    isAction: true,
  },
]

const bottomItems = [
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
]

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { switchToCitizen, logout, user } = useRole()
  const [hoveredItem, setHoveredItem] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-50 glass-sidebar sidebar-elevated flex flex-col transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${collapsed ? 'w-[78px]' : 'w-[260px]'
        }`}
    >
      {/* Logo Area */}
      <div className="px-5 py-6 flex items-center gap-3 border-b border-white/20">
        {/* Animated Logo */}
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 glow-breathe">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          {/* Orbital dot */}
          <div className="absolute -top-1 -right-1 w-3 h-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-orbit" />
          </div>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-display font-extrabold text-lg text-slate-800 leading-tight whitespace-nowrap">
              Civic<span className="gradient-text">Pulse</span>
            </h1>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">
              Smart City Platform
            </p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Navigation
          </p>
        )}
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 relative magnetic-hover ${item.isAction
                ? 'mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5'
                : active
                  ? 'bg-emerald-50/80 text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              {/* Active indicator */}
              {active && !item.isAction && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-r-full shadow-glow" />
              )}

              {/* Icon container */}
              <div
                className={`flex-shrink-0 transition-all duration-300 ${active ? 'text-emerald-600' : item.isAction ? 'text-white' : 'text-slate-400 group-hover:text-emerald-500'
                  } ${hoveredItem === item.id && !item.isAction ? 'scale-110' : ''}`}
              >
                {item.icon}
              </div>

              {/* Label */}
              {!collapsed && (
                <span className={`text-sm font-semibold whitespace-nowrap ${item.isAction ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              )}

              {/* Badge */}
              {item.badge && !collapsed && (
                <div className="ml-auto flex-shrink-0">
                  <span className="inline-flex items-center justify-center w-6 h-6 text-[11px] font-bold rounded-full bg-emerald-500 text-white badge-float shadow-sm">
                    {item.badge}
                  </span>
                </div>
              )}

              {/* Hover glow */}
              {hoveredItem === item.id && !item.isAction && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-50/50 to-teal-50/50 -z-10 transition-opacity" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-3 py-4 border-t border-white/20 space-y-1">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-slate-400 hover:bg-white/50 hover:text-slate-600 ${collapsed ? 'justify-center' : ''
              }`}
          >
            <div className="flex-shrink-0 group-hover:text-emerald-500 transition-colors">
              {item.icon}
            </div>
            {!collapsed && (
              <span className="text-sm font-semibold">{item.label}</span>
            )}
          </button>
        ))}

        {/* Citizen View Button */}
        <button
          onClick={switchToCitizen}
          className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-slate-400 hover:bg-emerald-50/50 hover:text-emerald-600 ${collapsed ? 'justify-center' : ''}`}
          title="Switch to Citizen View"
        >
          <div className="flex-shrink-0 group-hover:text-emerald-500 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          {!collapsed && <span className="text-sm font-semibold">Citizen View</span>}
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-slate-400 hover:bg-red-50/50 hover:text-red-500 ${collapsed ? 'justify-center' : ''}`}
          title="Logout"
        >
          <div className="flex-shrink-0 group-hover:text-red-400 transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </div>
          {!collapsed && <span className="text-sm font-semibold">Logout</span>}
        </button>

        {/* User Avatar */}
        <div className={`flex items-center gap-3 px-3 py-3 mt-2 rounded-xl bg-white/40 border border-white/30 ${collapsed ? 'justify-center' : ''}`}>
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user?.name?.[0] || 'A'}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white pulse-glow" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-slate-700 truncate">{user?.name || 'Admin Panel'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@civicpulse.io'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:shadow-lg transition-all z-50"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </aside>
  )
}
