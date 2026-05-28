import React, { useState, useEffect } from 'react'
import { createComplaint } from '../services/complaintService'
import { getSystemStats } from '../services/statsService'
import ImageUpload from '../components/citizen/ImageUpload'
import LocationDetector from '../components/citizen/LocationDetector'
import SuccessModal from '../components/shared/SuccessModal'

function CitizenHome() {
  const [formData, setFormData] = useState({
    complaintType: '',
    description: '',
    latitude: null,
    longitude: null,
    image: null,
    imagePreview: null
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [generatedId, setGeneratedId] = useState('')

  // Real-time stats
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    resolutionRate: 0,
    avgResolutionHours: 0
  })
  const [statsLoading, setStatsLoading] = useState(true)

  // Fetch stats on mount
  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  const fetchStats = async () => {
    const result = await getSystemStats()
    if (result.success) {
      setStats(result.data)
    }
    setStatsLoading(false)
  }

  const handleImageSelect = (file, preview) => {
    setFormData({
      ...formData,
      image: file,
      imagePreview: preview
    })
  }

  const handleLocationDetect = (lat, lng) => {
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      const newErrors = {}
      
      if (!formData.complaintType) {
        newErrors.complaintType = 'Please select complaint type'
      }
      
      if (!formData.description || formData.description.length < 10) {
        newErrors.description = 'Description must be at least 10 characters'
      }
      
      if (!formData.image) {
        newErrors.image = 'Please upload an image'
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
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

      if (response.success) {
        setGeneratedId(response.data.complaint.complaintId)
        setShowSuccess(true)
        
        setFormData({
          complaintType: '',
          description: '',
          latitude: null,
          longitude: null,
          image: null,
          imagePreview: null
        })
        
        // Refresh stats after successful submission
        fetchStats()
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      
      {/* Hero Section with Real Stats */}
      <div className="pt-20 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Heading */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold">
                🏙️ RESIDENT ISSUE DASHBOARD
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4">
              A Smarter Way to
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">
                Manage Civic Issues
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Bridge the gap between citizens and administration. Real-time complaint tracking
              and transparent resolution.
            </p>
          </div>

          {/* Real-Time Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            
            {/* Total Reports */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-bold">
                  ● LIVE
                </span>
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">
                {statsLoading ? '...' : stats.total.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 font-medium">Total Reports</p>
            </div>

            {/* Fixed Issues */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-bold">
                  ● LIVE
                </span>
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">
                {statsLoading ? '...' : stats.resolved.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 font-medium">Fixed Issues</p>
            </div>

            {/* Success Rate */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-bold">
                  ● LIVE
                </span>
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">
                {statsLoading ? '...' : `${stats.resolutionRate}%`}
              </p>
              <p className="text-sm text-gray-600 font-medium">Success Rate</p>
            </div>

            {/* Avg Response */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full font-bold">
                  ● LIVE
                </span>
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">
                {statsLoading ? '...' : `${stats.avgResolutionHours}h`}
              </p>
              <p className="text-sm text-gray-600 font-medium">Avg Response</p>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Real numbers from real communities using CivicPulse every day
            </p>
          </div>
        </div>
      </div>

      {/* Complaint Submission Form */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
          
          {/* Form Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-gray-900 mb-2">
              Report a Civic Issue
            </h2>
            <p className="text-gray-600">
              Help improve your community by reporting issues with photos and location
            </p>
          </div>

          {/* Error Alert */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 font-medium">{errors.submit}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Complaint Type */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Complaint Type *
              </label>
              <select
                value={formData.complaintType}
                onChange={(e) => setFormData({ ...formData, complaintType: e.target.value })}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
                  errors.complaintType ? 'border-red-500' : 'border-gray-200'
                }`}
              >
                <option value="">Select complaint type</option>
                <option value="pothole">Pothole</option>
                <option value="streetlight">Streetlight</option>
                <option value="garbage">Garbage Collection</option>
                <option value="water">Water Supply</option>
                <option value="drainage">Drainage</option>
                <option value="road">Road Damage</option>
                <option value="electricity">Electricity</option>
                <option value="sewage">Sewage</option>
                <option value="other">Other</option>
              </select>
              {errors.complaintType && (
                <p className="text-red-500 text-sm mt-1">{errors.complaintType}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the issue in detail..."
                rows={4}
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
                  errors.description ? 'border-red-500' : 'border-gray-200'
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Location Detector */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Location (Optional)
              </label>
              <LocationDetector onLocationDetect={handleLocationDetect} />
              {formData.latitude && formData.longitude && (
                <p className="text-sm text-emerald-600 mt-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Location detected: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Upload Image *
              </label>
              <ImageUpload onImageSelect={handleImageSelect} />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Complaint'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          complaintId={generatedId}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  )
}

export default CitizenHome