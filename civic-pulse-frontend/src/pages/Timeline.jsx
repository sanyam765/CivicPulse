import React, { useState } from 'react'
import TopBar from '../components/shared/TopBar'

const timelineData = [
    {
        id: 1,
        date: 'Today',
        events: [
            { id: 'e1', time: '2:30 PM', type: 'resolved', title: 'Storm drain cleared on Riverside Dr', category: 'drainage', assignee: 'Drainage Team C', description: 'Successfully cleared debris blocking storm drain. Normal flow restored.' },
            { id: 'e2', time: '1:15 PM', type: 'assigned', title: 'Crew dispatched for water leak', category: 'water', assignee: 'Water Department', description: 'Emergency crew dispatched to Oak Residence Complex for water main repair.' },
            { id: 'e3', time: '11:45 AM', type: 'submitted', title: 'New complaint: Pothole on Main St', category: 'pothole', assignee: null, description: 'Citizen reported severe pothole causing vehicle damage. 15 upvotes in 2 hours.' },
            { id: 'e4', time: '10:00 AM', type: 'updated', title: 'Streetlight repair in progress', category: 'streetlight', assignee: 'Electric Team B', description: 'Parts ordered. Expected completion by tomorrow evening.' },
        ],
    },
    {
        id: 2,
        date: 'Yesterday',
        events: [
            { id: 'e5', time: '5:30 PM', type: 'resolved', title: 'Garbage collection completed', category: 'garbage', assignee: 'Sanitation Team A', description: 'All overflowing bins on Market Street cleared. Extra collection scheduled.' },
            { id: 'e6', time: '3:00 PM', type: 'escalated', title: 'Pedestrian signal failure escalated', category: 'streetlight', assignee: 'Signal Team A', description: 'Priority upgraded to urgent due to proximity to school zone.' },
            { id: 'e7', time: '12:00 PM', type: 'assigned', title: 'Road repair crew assigned', category: 'road', assignee: 'Road Team Delta', description: 'Team assigned for Highway 12 surface repair. Equipment mobilization started.' },
            { id: 'e8', time: '9:30 AM', type: 'submitted', title: 'Illegal dumping reported', category: 'garbage', assignee: null, description: 'Large-scale illegal dumping near River Valley Park river bank.' },
        ],
    },
    {
        id: 3,
        date: '2 Days Ago',
        events: [
            { id: 'e9', time: '4:00 PM', type: 'resolved', title: 'Speed bump repaired', category: 'road', assignee: 'Road Team Alpha', description: 'Damaged speed bump replaced with new reinforced unit.' },
            { id: 'e10', time: '2:15 PM', type: 'updated', title: 'Water tanker deployed', category: 'water', assignee: 'Water Department', description: 'Temporary water tanker stationed at Oak Residence Complex.' },
            { id: 'e11', time: '10:00 AM', type: 'submitted', title: 'Dark alley safety concern', category: 'streetlight', assignee: null, description: 'Multiple streetlights out in residential alley. Safety hazard reported.' },
        ],
    },
]

const eventTypeConfig = {
    submitted: {
        color: '#f59e0b',
        bg: 'bg-amber-50',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
        ),
        label: 'Submitted',
    },
    assigned: {
        color: '#3b82f6',
        bg: 'bg-blue-50',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
        label: 'Assigned',
    },
    updated: {
        color: '#8b5cf6',
        bg: 'bg-purple-50',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
        ),
        label: 'Updated',
    },
    resolved: {
        color: '#10b981',
        bg: 'bg-emerald-50',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
        label: 'Resolved',
    },
    escalated: {
        color: '#ef4444',
        bg: 'bg-red-50',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
        ),
        label: 'Escalated',
    },
}

const categoryIcons = {
    pothole: '🕳️',
    streetlight: '💡',
    garbage: '🗑️',
    water: '💧',
    drainage: '🌊',
    road: '🛣️',
}

function TimelineEvent({ event, index }) {
    const [expanded, setExpanded] = useState(false)
    const config = eventTypeConfig[event.type]

    return (
        <div className="relative flex gap-4 group" style={{ animationDelay: `${index * 100}ms` }}>
            {/* Timeline line */}
            <div className="absolute left-[19px] top-10 bottom-0 w-[2px] bg-gradient-to-b from-slate-200 to-transparent" />

            {/* Floating Marker */}
            <div className="relative z-10 flex-shrink-0 mt-1">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg float-gentle"
                    style={{
                        backgroundColor: `${config.color}15`,
                        color: config.color,
                        boxShadow: `0 4px 12px ${config.color}20`,
                        animationDelay: `${index * 300}ms`,
                    }}
                >
                    {config.icon}
                </div>
            </div>

            {/* Content Card */}
            <div
                className="flex-1 glass rounded-xl p-4 mb-4 shadow-sm hover:shadow-float transition-all duration-300 cursor-pointer spring-hover group-hover:bg-white/70"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{categoryIcons[event.category]}</span>
                            <span
                                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                                style={{
                                    backgroundColor: `${config.color}15`,
                                    color: config.color,
                                }}
                            >
                                {config.label}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{event.time}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">
                            {event.title}
                        </h4>
                    </div>

                    <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className={`text-slate-300 flex-shrink-0 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}
                    >
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </div>

                {expanded && (
                    <div className="mt-3 pt-3 border-t border-slate-100/60 animate-slide-up">
                        <p className="text-xs text-slate-500 leading-relaxed mb-2">{event.description}</p>
                        {event.assignee && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <span className="font-medium">{event.assignee}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default function Timeline() {
    const [typeFilter, setTypeFilter] = useState('all')

    return (
        <div className="animate-fade-in">
            <TopBar
                title="Timeline"
                subtitle="Complaint resolution timeline with floating markers"
            />

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Timeline */}
                <div className="xl:col-span-3">
                    {/* Filter */}
                    <div className="glass rounded-2xl shadow-float p-4 mb-6 flex items-center gap-2 flex-wrap">
                        <button
                            onClick={() => setTypeFilter('all')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${typeFilter === 'all' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:bg-white/50'
                                }`}
                        >
                            All Events
                        </button>
                        {Object.entries(eventTypeConfig).map(([key, config]) => (
                            <button
                                key={key}
                                onClick={() => setTypeFilter(key)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${typeFilter === key ? 'shadow-sm text-white' : 'text-slate-500 hover:bg-white/50'
                                    }`}
                                style={typeFilter === key ? { backgroundColor: config.color } : {}}
                            >
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                                {config.label}
                            </button>
                        ))}
                    </div>

                    {/* Timeline Days */}
                    {timelineData.map((day) => {
                        const filteredEvents = typeFilter === 'all'
                            ? day.events
                            : day.events.filter((e) => e.type === typeFilter)

                        if (filteredEvents.length === 0) return null

                        return (
                            <div key={day.id} className="mb-8">
                                {/* Day Header */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="glass-strong rounded-xl px-4 py-2 shadow-sm levitate" style={{ animationDuration: '8s' }}>
                                        <span className="font-display text-sm font-bold text-slate-700">{day.date}</span>
                                    </div>
                                    <div className="flex-1 h-[1px] bg-gradient-to-r from-slate-200 to-transparent" />
                                    <span className="text-xs font-semibold text-slate-400">{filteredEvents.length} events</span>
                                </div>

                                {/* Events */}
                                <div className="pl-2">
                                    {filteredEvents.map((event, i) => (
                                        <TimelineEvent key={event.id} event={event} index={i} />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Summary Sidebar */}
                <div className="space-y-5">
                    {/* Event Type Stats */}
                    <div className="glass rounded-2xl shadow-float p-5">
                        <h3 className="font-display text-base font-bold text-slate-800 mb-4">Activity Summary</h3>
                        <div className="space-y-3">
                            {Object.entries(eventTypeConfig).map(([key, config]) => {
                                const count = timelineData.reduce(
                                    (acc, day) => acc + day.events.filter((e) => e.type === key).length, 0
                                )
                                return (
                                    <div key={key} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/40 transition-all group">
                                        <div
                                            className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                                            style={{
                                                backgroundColor: `${config.color}15`,
                                                color: config.color,
                                            }}
                                        >
                                            {config.icon}
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-xs font-semibold text-slate-600">{config.label}</span>
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{count}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="glass rounded-2xl shadow-float p-5">
                        <h3 className="font-display text-base font-bold text-slate-800 mb-4">By Category</h3>
                        <div className="space-y-2">
                            {Object.entries(categoryIcons).map(([key, icon]) => {
                                const count = timelineData.reduce(
                                    (acc, day) => acc + day.events.filter((e) => e.category === key).length, 0
                                )
                                if (count === 0) return null
                                return (
                                    <div key={key} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/40 transition-all">
                                        <span className="text-lg">{icon}</span>
                                        <span className="text-xs font-semibold text-slate-600 capitalize flex-1">{key}</span>
                                        <span className="text-sm font-bold text-slate-700">{count}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Recent Resolutions */}
                    <div className="glass rounded-2xl shadow-float p-5">
                        <h3 className="font-display text-base font-bold text-slate-800 mb-4">Recent Wins 🎉</h3>
                        <div className="space-y-3">
                            {timelineData
                                .flatMap((d) => d.events.filter((e) => e.type === 'resolved'))
                                .slice(0, 3)
                                .map((event) => (
                                    <div key={event.id} className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100/50">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm">{categoryIcons[event.category]}</span>
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase">Resolved</span>
                                        </div>
                                        <p className="text-xs font-semibold text-slate-700">{event.title}</p>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
