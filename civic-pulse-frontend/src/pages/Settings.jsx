import React, { useEffect, useState } from 'react'
import TopBar from '../components/shared/TopBar'
import { useAuth } from '../context/AuthContext'

export default function Settings() {
    const { admin, loading, refreshAuth, logout } = useAuth()
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [lastSyncedAt, setLastSyncedAt] = useState(null)

    useEffect(() => {
        if (!loading && admin) {
            setLastSyncedAt(new Date())
        }
    }, [admin, loading])

    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            await refreshAuth()
            setLastSyncedAt(new Date())
        } finally {
            setIsRefreshing(false)
        }
    }

    const profileName = admin?.name || 'Unknown user'
    const profileEmail = admin?.email || 'No email available'
    const profileRole = admin?.role || 'citizen'
    const profileDepartment = admin?.department || 'Not assigned'

    if (loading && !admin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <TopBar title="Settings" subtitle="Live account information and session controls" />

            <div className="max-w-3xl mx-auto space-y-6">
                <div className="glass rounded-2xl shadow-float p-6">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="font-display text-lg font-bold text-slate-800">Account</h2>
                            <p className="text-sm text-slate-400 mt-1">This view reflects the authenticated user returned by the backend.</p>
                        </div>
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live sync
                        </span>
                    </div>

                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">
                            {profileName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">{profileName}</h3>
                            <p className="text-sm text-slate-400">{profileEmail}</p>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300 mt-1">{profileRole}</p>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-white/50 border border-white/60">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Role</p>
                            <p className="text-sm font-bold text-slate-800 capitalize">{profileRole}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/50 border border-white/60">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Department</p>
                            <p className="text-sm font-bold text-slate-800">{profileDepartment}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/50 border border-white/60">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Last synced</p>
                            <p className="text-sm font-bold text-slate-800">
                                {lastSyncedAt ? lastSyncedAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : 'Waiting for sync'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass rounded-2xl shadow-float p-6">
                    <h2 className="font-display text-lg font-bold text-slate-800 mb-4">Session</h2>
                    <p className="text-sm text-slate-500 mb-6">
                        The page auto-syncs with the backend user record through your active auth token. No local-only theme or notification toggles are kept here.
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={isRefreshing || loading}
                            className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isRefreshing ? 'Refreshing...' : 'Refresh from backend'}
                        </button>
                        <button
                            type="button"
                            onClick={logout}
                            className="px-5 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                        >
                            Sign out
                        </button>
                    </div>
                </div>

                <div className="glass rounded-2xl shadow-float p-6">
                    <h2 className="font-display text-lg font-bold text-slate-800 mb-4">Live status</h2>
                    <div className="space-y-3 text-sm text-slate-500">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/40">
                            <span>Backend-authenticated account</span>
                            <span className="font-bold text-emerald-600">{loading ? 'Syncing' : 'Connected'}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/40">
                            <span>Notifications settings</span>
                            <span className="font-bold text-slate-500">Managed elsewhere</span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/40">
                            <span>Theme preferences</span>
                            <span className="font-bold text-slate-500">Using app theme</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
