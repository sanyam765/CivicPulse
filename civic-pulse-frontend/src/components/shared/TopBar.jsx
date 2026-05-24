import React, { useEffect, useState } from 'react'
import { getAllComplaints } from '../../services/complaintService'

export default function TopBar({ title, subtitle }) {
    const [showNotifications, setShowNotifications] = useState(false)
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await getAllComplaints()
                const complaints = response.data.complaints || []

                // Surface unresolved complaints as live top-bar notifications.
                const items = complaints
                    .filter(complaint => complaint.status !== 'Resolved')
                    .slice(0, 5)
                    .map((complaint) => ({
                        id: complaint.complaintId,
                        message: `${complaint.complaintType} is ${complaint.status.toLowerCase()}`,
                        time: new Date(complaint.updatedAt || complaint.createdAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                        })
                    }))

                setNotifications(items)
            } catch (error) {
                setNotifications([])
            }
        }

        fetchNotifications()
    }, [])

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
                <button className="relative p-2.5 glass rounded-xl shadow-sm hover:shadow-glass transition-all duration-300 group">
                    <span
                        className="absolute inset-0"
                        onClick={() => setShowNotifications(!showNotifications)}
                    />
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-slate-500 group-hover:text-emerald-500 transition-colors">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center shadow-sm pulse-glow" style={{ boxShadow: '0 0 8px rgba(239,68,68,0.4)' }}>
                        {notifications.length}
                    </span>
                </button>

                {showNotifications && (
                    <div className="absolute right-8 top-20 w-80 bg-white rounded-2xl shadow-xl border z-50 overflow-hidden">
                        <div className="p-4 border-b">
                            <h3 className="font-black text-gray-900">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-sm text-gray-500">No recent notifications.</div>
                            ) : (
                                notifications.map((notif) => (
                                    <div key={notif.id} className="p-4 border-b hover:bg-gray-50">
                                        <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    )
}
