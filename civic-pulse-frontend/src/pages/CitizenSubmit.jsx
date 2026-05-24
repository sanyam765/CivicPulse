import React, { useState, useEffect } from 'react'
import { AlertCircle, MapPin, Search, ArrowRight, Camera, FileCheck2, Clock, CheckCircle2 } from 'lucide-react'
import ImageUpload from '../components/citizen/ImageUpload'
import LocationDetector from '../components/citizen/LocationDetetctor'
import SuccessModal from '../components/shared/SuccessModal'
import { Link } from 'react-router-dom'
import { createComplaint } from '../services/complaintService'

function useScrollReveal() {
    const [isVisible, setIsVisible] = useState(false)
    const ref = React.useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    return [ref, isVisible]
}

export default function CitizenSubmit() {
    const [formData, setFormData] = useState({
        complaintType: '',
        description: '',
        latitude: null,
        longitude: null,
        image: null,
        imagePreview: null
    })
    const [showSuccess, setShowSuccess] = useState(false)
    const [generatedId, setGeneratedId] = useState('')
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [activeStep, setActiveStep] = useState(1)

    const [headerRef, headerVisible] = useScrollReveal()
    const [formRef, formVisible] = useScrollReveal()
    const [contextRef, contextVisible] = useScrollReveal()

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' })
        }
    }

    const handleImageSelect = (file, preview) => {
        setFormData({
            ...formData,
            image: file,
            imagePreview: preview
        })
        if (errors.image) {
            setErrors({ ...errors, image: '' })
        }
        setActiveStep(Math.max(activeStep, 2))
    }

    const handleLocationDetect = (lat, lng) => {
        setFormData({
            ...formData,
            latitude: lat,
            longitude: lng
        })
        setActiveStep(3)
    }

    const generateComplaintId = () => {
        const timestamp = Date.now().toString().slice(-6)
        const random = Math.floor(Math.random() * 1000)
        return `CMP-${timestamp}${random}`
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.complaintType) newErrors.complaintType = 'Please select a complaint type'
        if (!formData.description.trim()) newErrors.description = 'Please provide a description'
        if (formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters'
        if (!formData.image) newErrors.image = 'Please upload an image'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        setLoading(true)

        try {
            if (!validateForm()) {
                setLoading(false)
                return
            }

            const complaintData = {
                complaintType: formData.complaintType,
                description: formData.description,
                image: formData.image
            }

            if (formData.latitude && formData.longitude) {
                complaintData.location = {
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                    address: 'Auto-detected location'
                }
            }

            const response = await createComplaint(complaintData)

            if (response.success || response.data?.complaint) {
                const complaint = response.data.complaint
                setGeneratedId(complaint.complaintId)
                setShowSuccess(true)

                setFormData({
                    complaintType: '',
                    description: '',
                    latitude: null,
                    longitude: null,
                    image: null,
                    imagePreview: null
                })
                setActiveStep(1)
            }
        } catch (error) {
            console.error('Submission error:', error)
            setErrors({
                submit: error.message || 'Failed to submit complaint. Please try again.'
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-mesh text-slate-800 pt-20">

            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-300/20 blur-[120px] animate-mesh-drift" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-300/20 blur-[150px] animate-mesh-drift" style={{ animationDelay: '-5s' }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">

                <div
                    ref={headerRef}
                    className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-1000 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                        }`}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-strong border-brand-200/50 mb-6 group levitate shadow-glow-lg text-brand-700">
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest">Resident Action Center</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-display font-extrabold mb-6 leading-tight">
                        Fixing Your City,<br />
                        <span className="text-gradient">One Report at a Time.</span>
                    </h1>
                    <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-2xl mx-auto">
                        Report infrastructure issues directly to the concerned authorities. Fast, transparent, and completely trackable.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    <div
                        ref={formRef}
                        className={`lg:col-span-8 transition-all duration-1000 delay-200 ${formVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                            }`}
                    >
                        <div className="glass-strong rounded-3xl p-1 shadow-floating relative overflow-hidden group">

                            <div className="absolute inset-0 bg-gradient-to-br from-brand-400 via-transparent to-cyan-400 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-700" />

                            <div className="bg-white/90 backdrop-blur-xl rounded-[1.35rem] p-6 sm:p-10 relative z-10">

                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
                                    <div>
                                        <h2 className="text-2xl font-display font-bold text-slate-800">New Complaint</h2>
                                        <p className="text-sm text-slate-500 font-medium">Please provide details to help us fix the issue faster.</p>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-400">Completion</span>
                                        <div className="flex gap-1">
                                            <div className={`w-8 h-1.5 rounded-full transition-colors duration-500 ${activeStep >= 1 ? 'bg-brand-500 shadow-glow' : 'bg-slate-200'}`} />
                                            <div className={`w-8 h-1.5 rounded-full transition-colors duration-500 ${activeStep >= 2 ? 'bg-brand-500 shadow-glow' : 'bg-slate-200'}`} />
                                            <div className={`w-8 h-1.5 rounded-full transition-colors duration-500 ${activeStep >= 3 ? 'bg-brand-500 shadow-glow' : 'bg-slate-200'}`} />
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {errors.submit && (
                                        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                            <span>{errors.submit}</span>
                                        </div>
                                    )}

                                    <div className="space-y-3" onClick={() => setActiveStep(Math.max(activeStep, 1))}>
                                        <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                                            Select Category
                                            {errors.complaintType && <span className="text-xs text-red-500">{errors.complaintType}</span>}
                                        </label>
                                        <div className="relative group/select">
                                            <select
                                                name="complaintType"
                                                value={formData.complaintType}
                                                onChange={handleInputChange}
                                                className={`w-full appearance-none bg-slate-50/50 border-2 rounded-xl px-5 py-4 font-medium text-slate-700 outline-none transition-all duration-300 hover:bg-white
                          ${errors.complaintType ? 'border-red-300 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]'
                                                        : 'border-slate-200 focus:border-brand-500 focus:shadow-[0_0_0_4px_rgba(20,184,166,0.1)] focus:bg-white'}`}
                                            >
                                                <option value="">Choose a specific category...</option>
                                                <option value="pothole">🕳️ Pothole – Road damage</option>
                                                <option value="streetlight">💡 Streetlight – Not working</option>
                                                <option value="garbage">🗑️ Garbage – Collection issue</option>
                                                <option value="water">💧 Water – Supply problem</option>
                                                <option value="drainage">🌊 Drainage – Blockage</option>
                                                <option value="road">🛣️ Road – Maintenance needed</option>
                                                <option value="other">📋 Other – Describe below</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400 group-hover/select:text-brand-500 transition-colors">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="6 9 12 15 18 9"></polyline>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3" onClick={() => setActiveStep(Math.max(activeStep, 2))}>
                                        <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                                            Photo Evidence
                                            {errors.image && <span className="text-xs text-red-500">{errors.image}</span>}
                                        </label>
                                        <div className={`transition-all duration-300 rounded-2xl ${errors.image ? 'ring-2 ring-red-400 ring-offset-2' : ''}`}>
                                            <ImageUpload onImageSelect={handleImageSelect} selectedImage={formData.imagePreview} />
                                        </div>
                                    </div>

                                    <div className="space-y-3" onClick={() => setActiveStep(3)}>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-brand-500" />
                                                Pin Location
                                            </label>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">Auto-Detect Available</span>
                                        </div>
                                        <LocationDetector onLocationDetect={handleLocationDetect} latitude={formData.latitude} longitude={formData.longitude} />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-sm font-bold text-slate-700 flex items-center justify-between">
                                            Detailed Description
                                            {errors.description && <span className="text-xs text-red-500">{errors.description}</span>}
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows={4}
                                                placeholder="Please describe the issue clearly. Mention landmarks, severity, or how long it's been an issue."
                                                className={`w-full bg-slate-50/50 border-2 rounded-xl px-5 py-4 font-medium text-slate-700 outline-none transition-all duration-300 hover:bg-white resize-none
                          ${errors.description ? 'border-red-300 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.1)]'
                                                        : 'border-slate-200 focus:border-brand-500 focus:shadow-[0_0_0_4px_rgba(20,184,166,0.1)] focus:bg-white'}`}
                                            />
                                            <div className="absolute right-3 bottom-3 text-xs font-bold text-slate-400 bg-white/80 px-2 py-1 rounded-md backdrop-blur-sm">
                                                {formData.description.length} chars
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full relative overflow-hidden group/btn bg-slate-900 border-2 border-slate-900 text-white rounded-xl py-4 sm:py-5 font-bold text-lg hover:text-white transition-all hover:shadow-[0_20px_40px_-10px_rgba(15,23,34,0.5)] focus:outline-none focus:ring-4 focus:ring-slate-900/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-cyan-500 translate-y-[100%] group-hover/btn:translate-y-[0%] transition-transform duration-500 ease-out z-0" />
                                            <div className="relative z-10 flex items-center justify-center gap-3">
                                                {loading ? 'Submitting...' : 'Submit Official Report'}
                                                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                            </div>
                                        </button>
                                        <p className="text-center text-xs font-medium text-slate-500 mt-4 flex items-center justify-center gap-2">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" /> Information securely transmitted directly to your municipality.
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div
                        ref={contextRef}
                        className={`lg:col-span-4 space-y-6 transition-all duration-1000 delay-300 ${contextVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
                            }`}
                    >

                        <div className="glass-card rounded-3xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-400/20 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-500" />

                            <div className="relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-5 text-brand-600">
                                    <FileCheck2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-display font-bold text-slate-800 mb-2">Track Resolution</h3>
                                <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
                                    Every report gets a unique Civic ID. You'll receive real-time status updates as city crews work on fixing the issue.
                                </p>
                                <Link to="/citizen/my-complaints" className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors group/link">
                                    View My Previous Reports
                                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>

                        <div className="glass-strong rounded-3xl p-6 shadow-sm relative levitate" style={{ animationDelay: '1s' }}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-800 tracking-tight">System Status</h3>
                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest border border-emerald-100">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Live
                                </span>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100/50 hover:bg-white transition-colors duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-500">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Avg. Response Time</div>
                                            <div className="text-lg font-display font-extrabold text-slate-800">2.4 Hours</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100/50 hover:bg-white transition-colors duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-500">
                                            <Search className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Departments</div>
                                            <div className="text-lg font-display font-extrabold text-slate-800">14 Teams</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800 text-white rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1563355/pexels-photo-1563355.jpeg?auto=compress&cs=tinysrgb&w=800')] bg-cover bg-center opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent" />
                            <div className="relative z-10 pt-10">
                                <h3 className="text-2xl font-display font-bold mb-2">Emergency?</h3>
                                <p className="text-sm font-medium text-slate-300 mb-6">
                                    For life-threatening situations, active fires, or immediate dangers, do not use this form.
                                </p>
                                <a href="tel:911" className="inline-flex w-full items-center justify-center gap-3 bg-white text-slate-900 font-bold px-6 py-4 rounded-xl hover:bg-slate-100 transition-colors shadow-[0_10px_30px_-10px_rgba(255,255,255,0.3)]">
                                    Call Emergency Services
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                complaintId={generatedId}
            />
        </div>
    )
}
