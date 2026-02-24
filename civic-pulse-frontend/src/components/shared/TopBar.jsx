import React from 'react'

export default function TopBar({ title, subtitle }) {
    return (
        <header className="flex items-center justify-between mb-8">
            <div>
                <h1 className="font-display text-3xl font-extrabold text-slate-800 tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm text-slate-400 mt-1 font-medium">{subtitle}</p>
                )}
            </div>

            <div className="flex items-center gap-4">
                {/* Search Bar with Glow */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center glass rounded-xl px-4 py-2.5 shadow-sm group-hover:shadow-glass transition-all duration-300 w-[280px]">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 group-focus-within:text-emerald-500 transition-colors flex-shrink-0">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search complaints..."
                            className="ml-3 bg-transparent border-none outline-none text-sm text-slate-600 placeholder:text-slate-400 w-full font-medium"
                            style={{ boxShadow: 'none' }}
                        />
                        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100/80 rounded-md border border-slate-200/50">
                            ⌘K
                        </kbd>
                    </div>
                </div>

                {/* Notification Bell */}
                <button className="relative p-2.5 glass rounded-xl shadow-sm hover:shadow-glass transition-all duration-300 group">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-slate-500 group-hover:text-emerald-500 transition-colors">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-sm pulse-glow" style={{ boxShadow: '0 0 8px rgba(239,68,68,0.4)' }}>
                        3
                    </span>
                </button>

                {/* Quick Add */}
                <button className="p-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 hover:-translate-y-0.5 group">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="group-hover:rotate-90 transition-transform duration-300">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                </button>
            </div>
        </header>
    )
}
