import React, { useState, useEffect } from 'react'
import { AlertCircle, Sparkles, Rocket, TrendingUp, Zap } from 'lucide-react'
import ImageUpload from '../components/citizen/ImageUpload'
import LocationDetector from '../components/citizen/LocationDetetctor'
import SuccessModal from '../components/shared/SuccessModal'
import HowItWorks from '../components/citizen/HowItWorks'
import LiveStats from '../components/citizen/LiveStats'
import RecentResolutions from '../components/citizen/RecentResolutions'
import FeaturesShowcase from '../components/citizen/FeaturesShowcase'
import FAQ from '../components/citizen/FAQ'
import CTASection from '../components/citizen/CTASection'

function CitizenHome() {
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

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
  }

  const handleLocationDetect = (lat, lng) => {
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng
    })
  }

  const generateComplaintId = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `CMP-${timestamp}${random}`
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.complaintType) {
      newErrors.complaintType = 'Please select a complaint type'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a description'
    }
    if (!formData.image) {
      newErrors.image = 'Please upload an image'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const complaintId = generateComplaintId()

    const complaint = {
      complaintId,
      complaintType: formData.complaintType,
      description: formData.description,
      latitude: formData.latitude,
      longitude: formData.longitude,
      imagePreview: formData.imagePreview,
      status: Math.random() > 0.5 ? 'Resolved' : 'Pending',
      createdAt: new Date().toISOString(),
      resolvedAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    }

    const existingComplaints = JSON.parse(localStorage.getItem('complaints') || '[]')
    existingComplaints.push(complaint)
    localStorage.setItem('complaints', JSON.stringify(existingComplaints))

    setGeneratedId(complaintId)
    setShowSuccess(true)

    setFormData({
      complaintType: '',
      description: '',
      latitude: null,
      longitude: null,
      image: null,
      imagePreview: null
    })
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background with Parallax */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-green-50 to-emerald-100"></div>
        
        {/* Floating shapes with parallax */}
        <div 
          className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) translateY(${scrollY * 0.2}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"
          style={{
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px) translateY(${scrollY * 0.3}px)`
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-emerald-200/20 rounded-full blur-3xl"
          style={{
            transform: `translate(-50%, -50%) translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`
          }}
        ></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(34, 197, 94, 0.1) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Hero Section */}
      <div className="relative py-20">
        <div className="container mx-auto px-4">
          {/* Floating badges */}
          <div className="absolute top-10 right-10 hidden lg:block">
            <div className="glass px-6 py-3 rounded-full shadow-lg animate-float-smooth">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full pulse-glow"></div>
                <span className="text-sm font-semibold text-primary-700">Live System</span>
              </div>
            </div>
          </div>

          {/* Hero Content with 3D effect */}
          <div className="text-center mb-20 relative">
            {/* Announcement Badge */}
            <div className="inline-flex items-center space-x-3 glass px-8 py-4 rounded-full shadow-xl mb-8 hover-lift hover-bounce group cursor-pointer">
              <Rocket className="w-6 h-6 text-primary-600 group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-bold bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
                Making Cities Smarter, One Report at a Time
              </span>
              <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
            </div>
            
            {/* Main Title with shimmer effect */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
              <span className="block text-gray-800 mb-2">Report Issues.</span>
              <span className="block text-shimmer">Get Results.</span>
            </h1>
            
            {/* Subtitle with gradient */}
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-12">
              Join <span className="font-bold text-primary-600">10,000+ citizens</span> transforming 
              our city through <span className="font-bold text-primary-600">real-time civic engagement</span>. 
              Your voice matters, and we're here to amplify it.
            </p>

            {/* CTA Buttons with advanced hover */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href="#submit-form"
                className="group relative px-10 py-5 bg-gradient-to-r from-primary-600 via-primary-500 to-green-500 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-glow-lg transform hover:scale-105 transition-all duration-500 overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  <span>Submit Complaint Now</span>
                </span>
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </a>
              
              <a
                href="#how-it-works"
                className="px-10 py-5 glass border-2 border-primary-300 text-primary-700 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover-bounce"
              >
                See How It Works
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-12">
              <div className="text-center group">
                <div className="text-4xl font-black text-primary-600 mb-1 group-hover:scale-110 transition-transform">
                  98%
                </div>
                <div className="text-sm text-gray-600 font-medium">Success Rate</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center group">
                <div className="text-4xl font-black text-primary-600 mb-1 group-hover:scale-110 transition-transform">
                  24h
                </div>
                <div className="text-sm text-gray-600 font-medium">Avg Response</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center group">
                <div className="text-4xl font-black text-primary-600 mb-1 group-hover:scale-110 transition-transform">
                  10K+
                </div>
                <div className="text-sm text-gray-600 font-medium">Issues Resolved</div>
              </div>
            </div>
          </div>

          {/* Enhanced Form Section */}
          <div className="max-w-5xl mx-auto mb-20" id="submit-form">
            <div className="relative">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 via-green-500 to-emerald-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              
              <div className="relative glass p-12 rounded-3xl shadow-2xl">
                {/* Form Header */}
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-green-500 rounded-2xl blur-lg opacity-50"></div>
                      <div className="relative bg-gradient-to-br from-primary-600 to-green-600 p-4 rounded-2xl shadow-xl">
                        <AlertCircle className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-gray-800">
                        Submit Complaint
                      </h2>
                      <p className="text-gray-600 font-medium">Fill out the form below to get started</p>
                    </div>
                  </div>
                  
                  <div className="hidden md:block glass px-4 py-2 rounded-full">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-primary-600" />
                      <span className="text-sm font-bold text-primary-700">Fast Track</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Complaint Type - Enhanced */}
                  <div className="group">
                    <label className="flex items-center space-x-2 text-sm font-black text-gray-700 mb-4 uppercase tracking-wide">
                      <span>Complaint Type</span>
                      <span className="text-red-500">*</span>
                      <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold">Required</span>
                    </label>
                    <div className="relative">
                      <select 
                        name="complaintType"
                        value={formData.complaintType}
                        onChange={handleInputChange}
                        className={`w-full px-6 py-5 text-lg border-3 rounded-2xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 transition-all duration-300 font-semibold appearance-none cursor-pointer ${
                          errors.complaintType 
                            ? 'border-red-400 bg-red-50' 
                            : 'border-gray-200 hover:border-primary-400 bg-white group-hover:shadow-lg'
                        }`}
                      >
                        <option value="">Choose a category...</option>
                        <option value="pothole">🕳️ Pothole - Road Damage</option>
                        <option value="streetlight">💡 Streetlight - Not Working</option>
                        <option value="garbage">🗑️ Garbage - Collection Issue</option>
                        <option value="water">💧 Water - Supply Problem</option>
                        <option value="drainage">🌊 Drainage - Blockage</option>
                        <option value="road">🛣️ Road - Maintenance Needed</option>
                        <option value="other">📋 Other - Describe Below</option>
                      </select>
                      {/* Custom dropdown arrow */}
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {errors.complaintType && (
                      <div className="mt-3 flex items-center space-x-2 text-red-600 animate-slide-up">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">{errors.complaintType}</span>
                      </div>
                    )}
                  </div>

                  {/* Description - Enhanced */}
                  <div className="group">
                    <label className="flex items-center space-x-2 text-sm font-black text-gray-700 mb-4 uppercase tracking-wide">
                      <span>Description</span>
                      <span className="text-red-500">*</span>
                      <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold">Required</span>
                    </label>
                    <div className="relative">
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="6"
                        className={`w-full px-6 py-5 text-lg border-3 rounded-2xl focus:ring-4 focus:ring-primary-200 focus:border-primary-500 transition-all duration-300 resize-none font-medium ${
                          errors.description 
                            ? 'border-red-400 bg-red-50' 
                            : 'border-gray-200 hover:border-primary-400 bg-white group-hover:shadow-lg'
                        }`}
                        placeholder="💬 Tell us what's happening... Be as detailed as possible. Include the exact location, when you noticed it, and how it's affecting the community."
                      ></textarea>
                      {/* Character counter */}
                      <div className="absolute bottom-4 right-4 text-xs font-semibold text-gray-400">
                        {formData.description.length} characters
                      </div>
                    </div>
                    {errors.description && (
                      <div className="mt-3 flex items-center space-x-2 text-red-600 animate-slide-up">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <span className="font-semibold">{errors.description}</span>
                      </div>
                    )}
                  </div>

                  {/* Location Detector - Enhanced */}
                  <LocationDetector 
                    onLocationDetect={handleLocationDetect}
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                  />

                  {/* Image Upload - Enhanced */}
                  <ImageUpload 
                    onImageSelect={handleImageSelect}
                    selectedImage={formData.imagePreview}
                  />
                  {errors.image && (
                    <div className="mt-3 flex items-center space-x-2 text-red-600 animate-slide-up">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">{errors.image}</span>
                    </div>
                  )}

                  {/* Submit Button - Ultra Enhanced */}
                  <div className="pt-6">
                    <button
                      type="submit"
                      className="group relative w-full py-6 bg-gradient-to-r from-primary-600 via-green-500 to-emerald-600 text-white rounded-2xl font-black text-2xl shadow-2xl hover:shadow-glow-lg transform hover:scale-[1.02] transition-all duration-500 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center justify-center space-x-3">
                        <Rocket className="w-7 h-7 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        <span>Submit Complaint Now</span>
                        <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                      {/* Animated shimmer effect */}
                      <div className="absolute inset-0 shimmer"></div>
                    </button>
                  </div>
                </form>

                {/* Enhanced Info Box */}
                <div className="mt-10 relative overflow-hidden rounded-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-green-500 opacity-10"></div>
                  <div className="relative flex items-start space-x-4 p-6 border-2 border-primary-200 rounded-2xl glass">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">💡</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-primary-900 mb-2 text-lg">Pro Tip for Faster Resolution</p>
                      <p className="text-primary-800 leading-relaxed font-medium">
                        After submitting, you'll receive a <span className="font-bold">unique tracking ID</span>. 
                        Screenshot it or write it down! Most issues are resolved within 
                        <span className="font-bold text-green-600"> 48-72 hours</span>. 
                        High-priority cases get attention within <span className="font-bold text-red-600">24 hours</span>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
      <div id="how-it-works">
        <LiveStats />
        <HowItWorks />
        <RecentResolutions />
        <FeaturesShowcase />
        <FAQ />
        <CTASection />
      </div>

      {/* Success Modal */}
      <SuccessModal 
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        complaintId={generatedId}
      />
    </div>
  )
}

export default CitizenHome