import React, { useState, useEffect } from 'react'
import TopBar from '../components/shared/TopBar'

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

function DonutChart({ segments, size = 180 }) {
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
                {/* Background ring */}
                <circle cx={center} cy={center} r={radius} fill="none" stroke="rgba(16,185,129,0.06)" strokeWidth={strokeWidth} />

                {/* Segments */}
                {segments.map((seg, i) => {
                    const segLength = (seg.value / 100) * circumference * animationProgress
                    const offset = circumference - segLength
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
                <span className="font-display text-3xl font-extrabold text-slate-800">2,847</span>
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

export default function Analytics() {
    const weeklyData = [
        { day: 'Mon', submitted: 45, resolved: 38 },
        { day: 'Tue', submitted: 52, resolved: 44 },
        { day: 'Wed', submitted: 38, resolved: 50 },
        { day: 'Thu', submitted: 61, resolved: 45 },
        { day: 'Fri', submitted: 55, resolved: 52 },
        { day: 'Sat', submitted: 28, resolved: 35 },
        { day: 'Sun', submitted: 20, resolved: 22 },
    ]

    const maxVal = Math.max(...weeklyData.flatMap(d => [d.submitted, d.resolved]))

    const donutSegments = [
        { label: 'Potholes', value: 32, color: '#10b981' },
        { label: 'Streetlights', value: 24, color: '#14b8a6' },
        { label: 'Garbage', value: 19, color: '#06b6d4' },
        { label: 'Water', value: 15, color: '#f59e0b' },
        { label: 'Other', value: 10, color: '#8b5cf6' },
    ]

    const wardData = [
        { name: 'Ward 1 - Downtown', complaints: 342, resolved: 298, rate: 87 },
        { name: 'Ward 2 - Midtown', complaints: 456, resolved: 412, rate: 90 },
        { name: 'Ward 3 - East End', complaints: 234, resolved: 189, rate: 81 },
        { name: 'Ward 4 - Central', complaints: 567, resolved: 534, rate: 94 },
        { name: 'Ward 5 - South', complaints: 389, resolved: 321, rate: 82 },
        { name: 'Ward 6 - Riverside', complaints: 198, resolved: 178, rate: 90 },
    ]

    return (
        <div className="animate-fade-in">
            <TopBar
                title="Analytics"
                subtitle="Performance metrics and complaint insights"
            />

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
                <MetricCard
                    title="Resolution Rate"
                    value="87%"
                    change="+2.4%"
                    color="#10b981"
                    delay={0}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
                />
                <MetricCard
                    title="Avg Response Time"
                    value="18h"
                    change="-3.2h"
                    color="#14b8a6"
                    delay={150}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                />
                <MetricCard
                    title="Citizen Satisfaction"
                    value="92%"
                    change="+5.1%"
                    color="#06b6d4"
                    delay={300}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" /><path d="M4 18h2" /></svg>}
                />
                <MetricCard
                    title="Active Crews"
                    value="24"
                    change="+3"
                    color="#f59e0b"
                    delay={450}
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>}
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
                {/* Weekly Bar Chart */}
                <div className="xl:col-span-2 glass rounded-2xl shadow-float p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="font-display text-lg font-bold text-slate-800">Weekly Overview</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Submitted vs Resolved</p>
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

                {/* Donut Chart */}
                <div className="glass rounded-2xl shadow-float p-6">
                    <h2 className="font-display text-lg font-bold text-slate-800 mb-1">Category Split</h2>
                    <p className="text-xs text-slate-400 mb-6">Distribution by type</p>

                    <div className="flex justify-center mb-6">
                        <DonutChart segments={donutSegments} />
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

            {/* Ward Performance */}
            <div className="glass rounded-2xl shadow-float p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="font-display text-lg font-bold text-slate-800">Ward Performance</h2>
                        <p className="text-xs text-slate-400 mt-0.5">Resolution rates by area</p>
                    </div>
                    <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-50/50 transition-all">
                        Export Report →
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {wardData.map((ward, i) => {
                        const [progress, setProgress] = useState(0)

                        useEffect(() => {
                            const timer = setTimeout(() => setProgress(ward.rate), 500 + i * 100)
                            return () => clearTimeout(timer)
                        }, [ward.rate, i])

                        return (
                            <div
                                key={i}
                                className="p-4 rounded-xl bg-white/40 hover:bg-white/60 transition-all duration-300 group spring-hover border border-white/30"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-sm font-bold text-slate-700 group-hover:text-emerald-700 transition-colors">{ward.name}</h4>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ward.rate >= 90 ? 'bg-emerald-50 text-emerald-600' :
                                            ward.rate >= 85 ? 'bg-teal-50 text-teal-600' :
                                                'bg-amber-50 text-amber-600'
                                        }`}>
                                        {ward.rate}%
                                    </span>
                                </div>

                                {/* Progress bar */}
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
                    })}
                </div>
            </div>
        </div>
    )
}
