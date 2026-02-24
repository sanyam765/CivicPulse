import React, { useState, useEffect } from 'react'
import TopBar from '../components/shared/TopBar'

export default function SubmitComplaint() {
    const [formData, setFormData] = useState({
        type: '',
        title: '',
        description: '',
        priority: 'medium',
        location: '',
    })
    const [step, setStep] = useState(1)
    const [detecting, setDetecting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [complaintId, setComplaintId] = useState('')

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value })
    }

    const handleDetectLocation = () => {
        setDetecting(true)
        setTimeout(() => {
            handleChange('location', '28.6139° N, 77.2090° E — New Delhi, India')
            setDetecting(false)
        }, 1500)
    }

    const handleSubmit = () => {
        const id = `CMP-${Date.now().toString().slice(-6)}`
        setComplaintId(id)
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <div className="animate-fade-in">
                <TopBar title="Submit Complaint" subtitle="File a new civic complaint" />
                <div className="max-w-lg mx-auto text-center py-16">
                    <div className="glass rounded-3xl shadow-float p-10 modal-elastic-in">
                        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-6 glow-breathe">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h2 className="font-display text-2xl font-extrabold text-slate-800 mb-2">
                            Complaint Submitted! 🎉
                        </h2>
                        <p className="text-sm text-slate-500 mb-6">Your complaint has been registered successfully.</p>

                        <div className="glass-strong rounded-xl p-4 mb-6">
                            <p className="text-xs font-semibold text-slate-400 mb-1">Tracking ID</p>
                            <p className="font-mono font-bold text-xl text-emerald-600">{complaintId}</p>
                        </div>

                        <p className="text-xs text-slate-400 mb-6">Save this ID to track your complaint status</p>

                        <button
                            onClick={() => { setSubmitted(false); setStep(1); setFormData({ type: '', title: '', description: '', priority: 'medium', location: '' }) }}
                            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all hover:-translate-y-0.5"
                        >
                            Submit Another
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="animate-fade-in">
            <TopBar title="Submit Complaint" subtitle="File a new civic complaint" />

            <div className="max-w-3xl mx-auto">
                {/* Progress Steps */}
                <div className="glass rounded-2xl shadow-float p-5 mb-6">
                    <div className="flex items-center justify-between">
                        {[
                            { num: 1, label: 'Category' },
                            { num: 2, label: 'Details' },
                            { num: 3, label: 'Location' },
                            { num: 4, label: 'Review' },
                        ].map((s, i) => (
                            <React.Fragment key={s.num}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${step >= s.num
                                            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
                                            : 'bg-slate-100 text-slate-400'
                                        } ${step === s.num ? 'scale-110 glow-breathe' : ''}`}>
                                        {step > s.num ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : s.num}
                                    </div>
                                    <span className={`text-xs font-semibold hidden sm:block ${step >= s.num ? 'text-emerald-600' : 'text-slate-400'
                                        }`}>{s.label}</span>
                                </div>
                                {i < 3 && (
                                    <div className="flex-1 mx-4 h-[2px] rounded-full bg-slate-100 overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-700"
                                            style={{ width: step > s.num ? '100%' : step === s.num ? '50%' : '0%' }}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Form Content */}
                <div className="glass rounded-2xl shadow-float p-8">
                    {/* Step 1: Category */}
                    {step === 1 && (
                        <div className="animate-slide-up">
                            <h2 className="font-display text-xl font-bold text-slate-800 mb-2">Select Category</h2>
                            <p className="text-sm text-slate-400 mb-6">Choose the type of issue you're reporting</p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {[
                                    { id: 'pothole', icon: '🕳️', label: 'Pothole', desc: 'Road damage' },
                                    { id: 'streetlight', icon: '💡', label: 'Streetlight', desc: 'Not working' },
                                    { id: 'garbage', icon: '🗑️', label: 'Garbage', desc: 'Collection issue' },
                                    { id: 'water', icon: '💧', label: 'Water', desc: 'Supply problem' },
                                    { id: 'drainage', icon: '🌊', label: 'Drainage', desc: 'Blockage' },
                                    { id: 'road', icon: '🛣️', label: 'Road', desc: 'Maintenance' },
                                ].map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleChange('type', cat.id)}
                                        className={`p-5 rounded-xl text-left transition-all duration-300 spring-hover border-2 ${formData.type === cat.id
                                                ? 'bg-emerald-50/80 border-emerald-300 shadow-lg shadow-emerald-500/10'
                                                : 'bg-white/40 border-transparent hover:bg-white/60 hover:border-emerald-200'
                                            }`}
                                    >
                                        <div className="text-2xl mb-2">{cat.icon}</div>
                                        <p className="text-sm font-bold text-slate-700">{cat.label}</p>
                                        <p className="text-[11px] text-slate-400">{cat.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Details */}
                    {step === 2 && (
                        <div className="animate-slide-up space-y-6">
                            <div>
                                <h2 className="font-display text-xl font-bold text-slate-800 mb-2">Complaint Details</h2>
                                <p className="text-sm text-slate-400 mb-6">Provide details about the issue</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    placeholder="Brief description of the issue"
                                    className="w-full px-4 py-3 bg-white/60 border-2 border-slate-200/60 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Description</label>
                                <textarea
                                    rows={5}
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    placeholder="Provide detailed information about the issue, including how it's affecting the community..."
                                    className="w-full px-4 py-3 bg-white/60 border-2 border-slate-200/60 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 transition-all resize-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3 block">Priority</label>
                                <div className="flex gap-3">
                                    {[
                                        { id: 'low', label: 'Low', color: 'emerald' },
                                        { id: 'medium', label: 'Medium', color: 'amber' },
                                        { id: 'high', label: 'High', color: 'red' },
                                    ].map((p) => (
                                        <button
                                            key={p.id}
                                            onClick={() => handleChange('priority', p.id)}
                                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border-2 ${formData.priority === p.id
                                                    ? p.color === 'emerald' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' :
                                                        p.color === 'amber' ? 'bg-amber-50 border-amber-300 text-amber-700' :
                                                            'bg-red-50 border-red-300 text-red-700'
                                                    : 'bg-white/40 border-transparent text-slate-500 hover:bg-white/60'
                                                }`}
                                        >
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Location */}
                    {step === 3 && (
                        <div className="animate-slide-up space-y-6">
                            <div>
                                <h2 className="font-display text-xl font-bold text-slate-800 mb-2">Location</h2>
                                <p className="text-sm text-slate-400 mb-6">Help us find the exact location</p>
                            </div>

                            <button
                                onClick={handleDetectLocation}
                                disabled={detecting}
                                className={`w-full flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed transition-all duration-300 ${formData.location
                                        ? 'border-emerald-300 bg-emerald-50/60'
                                        : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                                    }`}
                            >
                                {detecting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-sm font-semibold text-emerald-600">Detecting location...</span>
                                    </>
                                ) : formData.location ? (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        <span className="text-sm font-semibold text-emerald-700">{formData.location}</span>
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                        <span className="text-sm font-semibold text-slate-500">Click to detect your location</span>
                                    </>
                                )}
                            </button>

                            {/* Mini Preview Map */}
                            {formData.location && (
                                <div className="h-[200px] rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden border border-emerald-100/50 animate-scale-in">
                                    <div className="absolute inset-0 opacity-[0.06]"
                                        style={{
                                            backgroundImage: 'linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)',
                                            backgroundSize: '30px 30px',
                                        }}
                                    />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                        <div className="map-pin">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500 border-3 border-white shadow-xl"
                                                style={{ boxShadow: '0 0 20px rgba(16,185,129,0.5)' }} />
                                        </div>
                                        <div className="w-8 h-2 rounded-full bg-black/10 mx-auto mt-1 map-pin-shadow" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {step === 4 && (
                        <div className="animate-slide-up space-y-6">
                            <div>
                                <h2 className="font-display text-xl font-bold text-slate-800 mb-2">Review & Submit</h2>
                                <p className="text-sm text-slate-400 mb-6">Verify your complaint details</p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { label: 'Category', value: formData.type, icon: '📋' },
                                    { label: 'Title', value: formData.title || 'Not provided', icon: '✏️' },
                                    { label: 'Description', value: formData.description || 'Not provided', icon: '📝' },
                                    { label: 'Priority', value: formData.priority, icon: '⚡' },
                                    { label: 'Location', value: formData.location || 'Not detected', icon: '📍' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/40 border border-white/30">
                                        <span className="text-lg">{item.icon}</span>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                                            <p className="text-sm font-semibold text-slate-700 capitalize">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100/60">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-white/50 rounded-xl transition-all"
                            >
                                ← Back
                            </button>
                        )}
                        <div className="ml-auto">
                            {step < 4 ? (
                                <button
                                    onClick={() => setStep(step + 1)}
                                    disabled={step === 1 && !formData.type}
                                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                                >
                                    Continue →
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all hover:-translate-y-0.5 group"
                                >
                                    <span className="flex items-center gap-2">
                                        Submit Complaint
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform">
                                            <polyline points="9 18 15 12 9 6" />
                                        </svg>
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
