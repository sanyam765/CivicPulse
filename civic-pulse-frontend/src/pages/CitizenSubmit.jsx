import React, { useState, useRef } from 'react'

const categoryData = [
    { id: 'pothole', icon: '🕳️', label: 'Pothole', desc: 'Road damage', color: '#ef4444' },
    { id: 'streetlight', icon: '💡', label: 'Streetlight', desc: 'Non-functional', color: '#f59e0b' },
    { id: 'garbage', icon: '🗑️', label: 'Garbage', desc: 'Waste issues', color: '#10b981' },
    { id: 'water', icon: '💧', label: 'Water', desc: 'Supply problems', color: '#3b82f6' },
    { id: 'drainage', icon: '🌊', label: 'Drainage', desc: 'Blockage', color: '#8b5cf6' },
    { id: 'road', icon: '🛣️', label: 'Road', desc: 'Maintenance', color: '#ec4899' },
]

export default function CitizenSubmit() {
    const [step, setStep] = useState(1)
    const [form, setForm] = useState({ type: '', title: '', description: '', priority: 'medium', location: '' })
    const [detecting, setDetecting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [complaintId, setComplaintId] = useState('')
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const fileRef = useRef()

    const update = (k, v) => setForm({ ...form, [k]: v })

    const handleImage = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const detectLocation = () => {
        setDetecting(true)
        setTimeout(() => {
            update('location', '28.6139° N, 77.2090° E — New Delhi, India')
            setDetecting(false)
        }, 1500)
    }

    const onSubmit = () => {
        const id = `CMP-${Date.now().toString().slice(-6)}`
        setComplaintId(id)

        const newComplaint = {
            id: id,
            type: form.type,
            title: form.title,
            description: form.description,
            priority: form.priority,
            location: form.location,
            status: 'pending',
            date: new Date().toISOString(),
            assignee: null,
            upvotes: 0,
            comments: 0
        }

        // Save to localStorage
        const existing = JSON.parse(localStorage.getItem('complaints') || '[]')
        existing.push(newComplaint)
        localStorage.setItem('complaints', JSON.stringify(existing))
        setSubmitted(true)
    }

    if (submitted) {
        return (
            <div className="min-h-screen relative">
                <div className="pt-28 pb-16 px-6">
                    <div className="max-w-lg mx-auto text-center">
                        <div className="glass rounded-3xl shadow-float p-10 modal-elastic-in">
                            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-400 to-teal-400 flex items-center justify-center shadow-xl shadow-emerald-500/30 mb-6 glow-breathe">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                            <h2 className="font-display text-3xl font-extrabold text-slate-800 mb-2">🎉 Submitted!</h2>
                            <p className="text-sm text-slate-500 mb-8">Your complaint has been registered.</p>

                            <div className="glass-strong rounded-xl p-5 mb-6">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tracking ID</p>
                                <p className="font-mono font-bold text-2xl text-emerald-600">{complaintId}</p>
                            </div>

                            <p className="text-xs text-slate-400 mb-8">Save this ID to track your complaint</p>

                            <div className="flex gap-3 justify-center">
                                <button onClick={() => { setSubmitted(false); setStep(1); setForm({ type: '', title: '', description: '', priority: 'medium', location: '' }); setImage(null); setImagePreview(null) }}
                                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all hover:-translate-y-0.5">
                                    Submit Another
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen relative">
            <div className="pt-28 pb-16 px-6">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-800 mb-2">
                            Submit a <span className="gradient-text">Complaint</span>
                        </h1>
                        <p className="text-sm text-slate-400">Follow the steps to report a civic issue</p>
                    </div>

                    {/* Progress Bar */}
                    <div className="glass rounded-2xl shadow-float p-5 mb-8">
                        <div className="flex items-center justify-between">
                            {['Category', 'Details', 'Location', 'Review'].map((label, i) => (
                                <React.Fragment key={i}>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${step > i + 1 ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20' :
                                            step === i + 1 ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 scale-110 glow-breathe' :
                                                'bg-slate-100 text-slate-400'
                                            }`}>
                                            {step > i + 1 ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg> : i + 1}
                                        </div>
                                        <span className={`text-xs font-semibold hidden sm:block ${step >= i + 1 ? 'text-emerald-600' : 'text-slate-400'}`}>{label}</span>
                                    </div>
                                    {i < 3 && <div className="flex-1 mx-3 h-[2px] rounded-full bg-slate-100 overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-700"
                                            style={{ width: step > i + 1 ? '100%' : step === i + 1 ? '50%' : '0%' }} />
                                    </div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="glass rounded-2xl shadow-float p-8">
                        {step === 1 && (
                            <div className="animate-slide-up">
                                <h2 className="font-display text-xl font-bold text-slate-800 mb-1">Select Category</h2>
                                <p className="text-sm text-slate-400 mb-6">Choose the type of issue</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {categoryData.map((cat) => (
                                        <button key={cat.id} onClick={() => update('type', cat.id)}
                                            className={`p-5 rounded-xl text-left transition-all duration-300 spring-hover border-2 ${form.type === cat.id
                                                ? 'bg-emerald-50/80 border-emerald-300 shadow-lg shadow-emerald-500/10'
                                                : 'bg-white/40 border-transparent hover:bg-white/60 hover:border-emerald-200'
                                                }`}>
                                            <div className="text-3xl mb-3">{cat.icon}</div>
                                            <p className="text-sm font-bold text-slate-700">{cat.label}</p>
                                            <p className="text-[11px] text-slate-400">{cat.desc}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-slide-up space-y-5">
                                <div>
                                    <h2 className="font-display text-xl font-bold text-slate-800 mb-1">Complaint Details</h2>
                                    <p className="text-sm text-slate-400 mb-6">Describe the issue</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Title</label>
                                    <input type="text" value={form.title} onChange={(e) => update('title', e.target.value)}
                                        placeholder="Brief description of the issue"
                                        className="w-full px-4 py-3 bg-white/60 border-2 border-slate-200/60 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Description</label>
                                    <textarea rows={4} value={form.description} onChange={(e) => update('description', e.target.value)}
                                        placeholder="Detailed information about the issue..."
                                        className="w-full px-4 py-3 bg-white/60 border-2 border-slate-200/60 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none transition-all resize-none" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Upload Photo</label>
                                    <input type="file" accept="image/*" onChange={handleImage} ref={fileRef} className="hidden" />
                                    <button onClick={() => fileRef.current?.click()}
                                        className={`w-full flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed transition-all duration-300 ${imagePreview ? 'border-emerald-300 bg-emerald-50/40' : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20'
                                            }`}>
                                        {imagePreview ? (
                                            <div className="flex items-center gap-3">
                                                <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                                                <span className="text-sm font-semibold text-emerald-600">Photo selected ✓</span>
                                            </div>
                                        ) : (
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                                                </svg>
                                                <span className="text-sm font-semibold text-slate-500">Click to upload a photo</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 block">Priority</label>
                                    <div className="flex gap-3">
                                        {[
                                            { id: 'low', label: 'Low', style: 'emerald' },
                                            { id: 'medium', label: 'Medium', style: 'amber' },
                                            { id: 'high', label: 'High', style: 'red' },
                                        ].map((p) => (
                                            <button key={p.id} onClick={() => update('priority', p.id)}
                                                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border-2 ${form.priority === p.id
                                                    ? p.style === 'emerald' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' :
                                                        p.style === 'amber' ? 'bg-amber-50 border-amber-300 text-amber-700' :
                                                            'bg-red-50 border-red-300 text-red-700'
                                                    : 'bg-white/40 border-transparent text-slate-500 hover:bg-white/60'
                                                    }`}>{p.label}</button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-slide-up space-y-5">
                                <h2 className="font-display text-xl font-bold text-slate-800 mb-1">Location</h2>
                                <p className="text-sm text-slate-400 mb-4">Pinpoint the issue location</p>
                                <button onClick={detectLocation} disabled={detecting}
                                    className={`w-full flex items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed transition-all ${form.location ? 'border-emerald-300 bg-emerald-50/60' : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20'
                                        }`}>
                                    {detecting ? (
                                        <><div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /><span className="text-sm font-bold text-emerald-600">Detecting location...</span></>
                                    ) : form.location ? (
                                        <><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg><span className="text-sm font-bold text-emerald-700">{form.location}</span></>
                                    ) : (
                                        <><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg><span className="text-sm font-bold text-slate-500">Click to detect your location via GPS</span></>
                                    )}
                                </button>
                                {form.location && (
                                    <div className="h-48 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden border border-emerald-100/50 animate-scale-in">
                                        <div className="absolute inset-0 opacity-[0.06]" style={{
                                            backgroundImage: 'linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)',
                                            backgroundSize: '25px 25px',
                                        }} />
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <div className="map-pin"><div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-xl" style={{ boxShadow: '0 0 20px rgba(16,185,129,0.5)' }} /></div>
                                            <div className="w-8 h-2 rounded-full bg-black/10 mx-auto mt-1 map-pin-shadow" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 4 && (
                            <div className="animate-slide-up space-y-4">
                                <h2 className="font-display text-xl font-bold text-slate-800 mb-1">Review & Submit</h2>
                                <p className="text-sm text-slate-400 mb-4">Verify details before submitting</p>
                                {[
                                    { label: 'Category', value: categoryData.find(c => c.id === form.type)?.label || form.type, icon: categoryData.find(c => c.id === form.type)?.icon || '📋' },
                                    { label: 'Title', value: form.title || '—', icon: '✏️' },
                                    { label: 'Description', value: form.description || '—', icon: '📝' },
                                    { label: 'Priority', value: form.priority, icon: '⚡' },
                                    { label: 'Location', value: form.location || 'Not detected', icon: '📍' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/40 border border-white/30">
                                        <span className="text-lg">{item.icon}</span>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                                            <p className="text-sm font-semibold text-slate-700 capitalize">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                                {imagePreview && (
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/40 border border-white/30">
                                        <span className="text-lg">📸</span>
                                        <div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Photo</p>
                                            <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-lg object-cover" /></div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Nav Buttons */}
                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100/60">
                            {step > 1 ? <button onClick={() => setStep(s => s - 1)} className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 hover:bg-white/50 rounded-xl transition-all">← Back</button> : <div />}
                            {step < 4 ? (
                                <button onClick={() => setStep(s => s + 1)} disabled={step === 1 && !form.type}
                                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0">
                                    Continue →
                                </button>
                            ) : (
                                <button onClick={onSubmit} className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl transition-all hover:-translate-y-0.5 group">
                                    <span className="flex items-center gap-2">Submit Complaint<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><polyline points="9 18 15 12 9 6" /></svg></span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
