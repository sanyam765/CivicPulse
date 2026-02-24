import React from 'react'
import TopBar from '../components/shared/TopBar'

export default function Settings() {
    return (
        <div className="animate-fade-in">
            <TopBar title="Settings" subtitle="Configure your preferences" />

            <div className="max-w-3xl mx-auto space-y-6">
                {/* Profile Section */}
                <div className="glass rounded-2xl shadow-float p-6">
                    <h2 className="font-display text-lg font-bold text-slate-800 mb-6">Profile</h2>
                    <div className="flex items-center gap-5 mb-6">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20">
                                AP
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white pulse-glow" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Admin Panel</h3>
                            <p className="text-sm text-slate-400">admin@civicpulse.io</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Display Name</label>
                            <input
                                type="text"
                                defaultValue="Admin Panel"
                                className="w-full px-4 py-3 bg-white/60 border-2 border-slate-200/60 rounded-xl text-sm font-medium text-slate-700 focus:border-emerald-400 transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Email</label>
                            <input
                                type="email"
                                defaultValue="admin@civicpulse.io"
                                className="w-full px-4 py-3 bg-white/60 border-2 border-slate-200/60 rounded-xl text-sm font-medium text-slate-700 focus:border-emerald-400 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="glass rounded-2xl shadow-float p-6">
                    <h2 className="font-display text-lg font-bold text-slate-800 mb-6">Notifications</h2>
                    <div className="space-y-4">
                        {[
                            { label: 'New complaint alerts', desc: 'Get notified when new complaints are submitted', enabled: true },
                            { label: 'Resolution updates', desc: 'Receive updates when complaints are resolved', enabled: true },
                            { label: 'Weekly reports', desc: 'Get weekly analytics digest', enabled: false },
                            { label: 'Urgent escalations', desc: 'Immediate alerts for urgent issues', enabled: true },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/40 hover:bg-white/60 transition-all group">
                                <div>
                                    <p className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">{item.label}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                                </div>
                                <div className={`w-11 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${item.enabled ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-200'
                                    }`}>
                                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${item.enabled ? 'left-[22px]' : 'left-0.5'
                                        }`} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Appearance */}
                <div className="glass rounded-2xl shadow-float p-6">
                    <h2 className="font-display text-lg font-bold text-slate-800 mb-6">Appearance</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Light', active: true, icon: '☀️' },
                            { label: 'Dark', active: false, icon: '🌙' },
                            { label: 'System', active: false, icon: '💻' },
                        ].map((theme, i) => (
                            <button
                                key={i}
                                className={`p-4 rounded-xl text-center transition-all duration-300 border-2 spring-hover ${theme.active
                                        ? 'bg-emerald-50/80 border-emerald-300 shadow-sm'
                                        : 'bg-white/40 border-transparent hover:bg-white/60'
                                    }`}
                            >
                                <div className="text-2xl mb-2">{theme.icon}</div>
                                <p className={`text-sm font-semibold ${theme.active ? 'text-emerald-700' : 'text-slate-500'}`}>{theme.label}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all hover:-translate-y-0.5">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}
