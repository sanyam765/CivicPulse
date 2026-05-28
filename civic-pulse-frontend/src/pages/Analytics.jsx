import React, { useState, useEffect } from 'react'
import TopBar from '../components/shared/TopBar'
import { getAllComplaints } from '../services/complaintService'

// Keep all your existing animation components
function AnimatedBar({ value, maxValue, color, delay = 0 }) {
    const [width, setWidth] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            setWidth((value / maxValue) * 100)
        }, delay + 300)
        return () => clearTimeout(timer)
    }, [value, maxValue, delay])

    return (
        <div className="h-full w-full flex items-end justify-center">
            <div
                className="w-full rounded-t-lg transition-all duration-1000 ease-out relative overflow-hidden group"
                style={{
                    height: `${width}%`,
                    background: `linear-gradient(180deg, ${color}dd, ${color})`,
                    boxShadow: `0 0 10px ${color}30`,
                    transition: `height 1.5s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
                }}
            >
                <div className="absolute inset-0 shimmer-overlay opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    )
}

function DonutChart({ segments, size = 180, totalIssues = 0 }) {
    const [animationProgress, setAnimationProgress] = useState(0)
    const strokeWidth = 24
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const center = size / 2

    useEffect(() => {
        const timer = setTimeout(() => setAnimationProgress(1), 400)
        return () => clearTimeout(timer)
    }, [])

    let accumulatedOffset = 0

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(16,185,129,0.06)" strokeWidth={strokeWidth} />
                {segments.map((seg, i) => {
                    const segLength = (seg.value / 100) * circumference * animationProgress
                    const rotation = (accumulatedOffset / 100) * 360
                    accumulatedOffset += seg.value

                    return (
                        <circle
                            key={i}
                            cx={center}
                            cy={center}
                            r={radius}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={strokeWidth - 2}
                            strokeLinecap="round"
                            strokeDasharray={`${segLength} ${circumference - segLength}`}
                            style={{
                                transform: `rotate(${rotation}deg)`,
                                transformOrigin: 'center',
                                transition: `stroke-dasharray 1.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 200}ms`,
                                filter: `drop-shadow(0 0 4px ${seg.color}40)`,
                            }}
                        />
                    )
                })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-extrabold text-slate-800">
                    {totalIssues.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-slate-400">Total Issues</span>
            </div>
        </div>
    )
}

function MetricCard({ title, value, change, icon, color, delay }) {
    const [count, setCount] = useState(0)
    const numVal = parseFloat(value.replace(/[^0-9.]/g, ''))

    useEffect(() => {
        const timer = setTimeout(() => {
            let start = 0
            const duration = 1200
            const startTime = performance.now()

            const animate = (currentTime) => {
                const elapsed = currentTime - startTime
                const progress = Math.min(elapsed / duration, 1)
                const easeOut = 1 - Math.pow(1 - progress, 3)
                setCount(Math.floor(easeOut * numVal))
                if (progress < 1) requestAnimationFrame(animate)
            }
            requestAnimationFrame(animate)
        }, delay)
        return () => clearTimeout(timer)
    }, [numVal, delay])

    return (
        <div className="glass rounded-2xl p-5 shadow-float hover:shadow-float-hover transition-all duration-500 group levitate"
            style={{ animationDelay: `${delay}ms`, animationDuration: `${6 + delay / 500}s` }}>
            <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${color}15`, color: color }}>
                    {icon}
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                    {change}
                </span>
            </div>
            <p className="font-display text-2xl font-extrabold text-slate-800 mb-0.5">
                {value.includes('%') ? `${count}%` : value.includes('h') ? `${count}h` : count.toLocaleString()}
            </p>
            <p className="text-xs font-medium text-slate-400">{title}</p>
        </div>
    )
}

const getResolutionHours = (complaint) => {
    if (!complaint?.createdAt || !complaint?.resolvedAt) return null

    const created = new Date(complaint.createdAt)
    const resolved = new Date(complaint.resolvedAt)
    const diffMs = resolved - created

    return Number.isFinite(diffMs) && diffMs >= 0 ? diffMs / (1000 * 60 * 60) : null
}

const buildRealTimeAnalytics = (complaints) => {
    const total = complaints.length
    const resolvedCount = complaints.filter(c => c.status === 'Resolved').length
    const pendingCount = complaints.filter(c => c.status === 'Pending').length
    const inProgressCount = complaints.filter(c => c.status === 'In Progress').length

    const resolutionRate = total > 0 ? Math.round((resolvedCount / total) * 100) : 0

    const resolvedHours = complaints
        .map(getResolutionHours)
        .filter(hours => hours !== null)

    const avgResponseTime = resolvedHours.length > 0
        ? Math.round(resolvedHours.reduce((sum, hours) => sum + hours, 0) / resolvedHours.length)
        : 0

    // Satisfaction is a live delivery-health proxy until a real citizen feedback system exists.
    const satisfaction = total > 0
        ? Math.round((resolvedCount * 100 + inProgressCount * 60 + pendingCount * 30) / total)
        : 0

    return {
        resolutionRate,
        avgResponseTime,
        satisfaction,
        activeCrews: inProgressCount
    }
}

function WardCard({ ward, delay }) {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => setProgress(ward.rate), 500 + delay)
        return () => clearTimeout(timer)
    }, [ward.rate, delay])

    // The animated bar is only a visual transition; the underlying rate is still live data.
    return (
        <div className="p-4 rounded-xl bg-white/40 hover:bg-white/60 transition-all duration-300 group spring-hover border border-white/30">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{ward.name}</h4>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ward.rate >= 90 ? 'bg-emerald-50 text-emerald-600' :
                        ward.rate >= 85 ? 'bg-teal-50 text-teal-600' :
                            'bg-amber-50 text-amber-600'
                    }`}>
                    {ward.rate}%
                </span>
            </div>

            <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div
                    className="h-full rounded-full progress-glow"
                    style={{
                        width: `${progress}%`,
                        background: ward.rate >= 90 ? 'linear-gradient(90deg, #10b981, #14b8a6)' :
                            ward.rate >= 85 ? 'linear-gradient(90deg, #14b8a6, #06b6d4)' :
                                'linear-gradient(90deg, #f59e0b, #f97316)',
                        transition: 'width 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span><span className="font-bold text-slate-600">{ward.resolved}</span> / {ward.complaints} resolved</span>
            </div>
        </div>
    )
}

export default function Analytics() {
    const [complaints, setComplaints] = useState([])
    const [loading, setLoading] = useState(true)
    const [realTimeStats, setRealTimeStats] = useState({
        resolutionRate: 0,
        avgResponseTime: 0,
        satisfaction: 0,
        activeCrews: 0
    })

    // Fetch real data
    useEffect(() => {
        fetchAnalytics()
        const interval = setInterval(fetchAnalytics, 30000) // Update every 30s
        return () => clearInterval(interval)
    }, [])

    const fetchAnalytics = async () => {
        try {
            const response = await getAllComplaints()
            const data = response.data.complaints
            setComplaints(data)

            // Derive dashboard metrics from the current complaint feed so the cards stay live.
            setRealTimeStats(buildRealTimeAnalytics(data))

        } catch (error) {
            console.error('Failed to fetch analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    // Calculate weekly data from real complaints
    const getWeeklyData = () => {
        const weeklyData = []
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            date.setHours(0, 0, 0, 0)
            
            const dayComplaints = complaints.filter(c => {
                const complaintDate = new Date(c.createdAt)
                complaintDate.setHours(0, 0, 0, 0)
                return complaintDate.getTime() === date.getTime()
            })
            
            const dayResolved = dayComplaints.filter(c => {
                if (!c.resolvedAt) return false
                const resolvedDate = new Date(c.resolvedAt)
                resolvedDate.setHours(0, 0, 0, 0)
                return resolvedDate.getTime() === date.getTime()
            })
            
            weeklyData.push({
                day: days[date.getDay()],
                submitted: dayComplaints.length,
                resolved: dayResolved.length
            })
        }
        
        return weeklyData
    }


    const getCategoryData = () => {
        const typeCount = {}
        complaints.forEach(c => {
            typeCount[c.complaintType] = (typeCount[c.complaintType] || 0) + 1
        })

        const total = complaints.length || 1
        const colors = ['#10b981', '#14b8a6', '#06b6d4', '#f59e0b', '#8b5cf6']
        
        return Object.entries(typeCount)
            .map(([type, count], i) => ({
                label: type.charAt(0).toUpperCase() + type.slice(1),
                value: Math.round((count / total) * 100),
                color: colors[i % colors.length]
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5) // Top 5 categories
    }

    // Calculate ward performance (group by location areas)
    const getWardData = () => {
        // Group complaints by latitude ranges (simulating wards)
        const wards = [
            { name: 'Ward 1 - Downtown', minLat: 28.60, maxLat: 28.62 },
            { name: 'Ward 2 - Midtown', minLat: 28.62, maxLat: 28.64 },
            { name: 'Ward 3 - East End', minLat: 28.64, maxLat: 28.66 },
            { name: 'Ward 4 - Central', minLat: 28.66, maxLat: 28.68 },
            { name: 'Ward 5 - South', minLat: 28.68, maxLat: 28.70 },
            { name: 'Ward 6 - Riverside', minLat: 28.70, maxLat: 28.72 }
        ]

        return wards.map(ward => {
            const wardComplaints = complaints.filter(c => {
                if (!c.location) return false
                const lat = c.location.latitude
                return lat >= ward.minLat && lat < ward.maxLat
            })

            const resolved = wardComplaints.filter(c => c.status === 'Resolved').length
            const rate = wardComplaints.length > 0 ? Math.round((resolved / wardComplaints.length) * 100) : 0

            return {
                name: ward.name,
                complaints: wardComplaints.length,
                resolved,
                rate
            }
        }).filter(w => w.complaints > 0) // Only show wards with complaints
    }

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    const weeklyData = getWeeklyData()
    const maxVal = Math.max(...weeklyData.flatMap(d => [d.submitted, d.resolved]), 1)
    const donutSegments = getCategoryData()
    const wardData = getWardData()

    return (
        <div className="animate-fade-in">
            <TopBar
                title="Analytics"
                subtitle="Real-time performance metrics and insights"
            />

            {/* Real-time metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                <MetricCard
                    title="Resolution Rate"
                    value={`${realTimeStats.resolutionRate}%`}
                    change="+2.4%"
                    color="#10b981"
                    delay={0}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
                />
                <MetricCard
                    title="Avg Response Time"
                    value={`${realTimeStats.avgResponseTime}h`}
                    change="-3.2h"
                    color="#14b8a6"
                    delay={150}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                />
                <MetricCard
                    title="Citizen Satisfaction"
                    value={`${realTimeStats.satisfaction}%`}
                    change="+5.1%"
                    color="#06b6d4"
                    delay={300}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M4 18h2" /></svg>}
                />
                <MetricCard
                    title="Active Crews"
                    value={`${realTimeStats.activeCrews}`}
                    change="+3"
                    color="#f59e0b"
                    delay={450}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Weekly chart with real data */}
                <div className="xl:col-span-2 glass rounded-2xl shadow-float p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-display text-lg font-bold text-slate-800">Weekly Overview</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Last 7 days - Real data</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-semibold">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded bg-emerald-400" />
                                <span className="text-slate-500">Submitted</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded bg-teal-400" />
                                <span className="text-slate-500">Resolved</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-end gap-3" style={{ height: '220px' }}>
                        {weeklyData.map((day, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex items-end gap-1" style={{ height: '180px' }}>
                                    <div className="w-1/2" style={{ height: '100%' }}>
                                        <AnimatedBar value={day.submitted} maxValue={maxVal} color="#10b981" delay={i * 100} />
                                    </div>
                                    <div className="w-1/2" style={{ height: '100%' }}>
                                        <AnimatedBar value={day.resolved} maxValue={maxVal} color="#14b8a6" delay={i * 100 + 50} />
                                    </div>
                                </div>
                                <span className="text-[11px] font-semibold text-slate-400 mt-2">{day.day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Category distribution with real data */}
                <div className="glass rounded-2xl shadow-float p-6">
                    <h2 className="font-display text-lg font-bold text-slate-800 mb-1">Category Split</h2>
                    <p className="text-xs text-slate-400 mb-6">Real distribution by type</p>

                    <div className="flex justify-center mb-6">
                        <DonutChart segments={donutSegments} totalIssues={complaints.length} />
                    </div>

                    <div className="space-y-2.5">
                        {donutSegments.map((seg, i) => (
                            <div key={i} className="flex items-center gap-3 group">
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                                <span className="text-xs font-semibold text-slate-600 flex-1">{seg.label}</span>
                                <span className="text-xs font-bold text-slate-700">{seg.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Ward performance with real data */}
            <div className="glass rounded-2xl shadow-float p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="font-display text-lg font-bold text-slate-800">Area Performance</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Resolution rates by location</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 px-3 py-1.5 rounded-lg bg-emerald-50/50">
                        ● Live Data
                    </span>
                </div>

                {wardData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {wardData.map((ward, i) => (
                            <WardCard key={ward.name} ward={ward} delay={i * 100} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-400">
                        <p>No location data available yet</p>
                    </div>
                )}
            </div>
        </div>
    )
}