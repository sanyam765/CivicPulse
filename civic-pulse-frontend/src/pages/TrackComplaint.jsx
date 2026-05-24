import React, { useState, useEffect } from 'react'
import { getComplaintById } from '../services/complaintService'
import { Search, MapPin, Calendar, AlertCircle } from 'lucide-react'

const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`
}

function TrackComplaint() {
  const [complaintId, setComplaintId] = useState('')
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Auto-paste from clipboard on mount
  useEffect(() => {
    const pasteFromClipboard = async () => {
      try {
        const text = await navigator.clipboard.readText()
        // Check if it looks like a complaint ID
        if (text.startsWith('CMP-')) {
          setComplaintId(text)
        }
      } catch (err) {
        // Clipboard permission denied, ignore
      }
    }
    pasteFromClipboard()
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!complaintId.trim()) {
      setError('Please enter a complaint ID')
      return
    }

    setLoading(true)
    setError('')
    setComplaint(null)

    try {
      const response = await getComplaintById(complaintId)
      setComplaint(response.data.complaint)
    } catch (error) {
      setError(error.message || 'Complaint not found')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200'
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Resolved': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-20 pb-10 px-6">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-5xl font-black text-gray-900 mb-4">Track Complaint</h1>
        <p className="text-xl text-gray-600 mb-8">Enter your complaint ID to check status</p>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <input
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              placeholder="Enter Complaint ID (e.g., CMP-1708567891234)"
              className="flex-1 px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 disabled:bg-gray-300"
            >
              {loading ? 'Searching...' : <Search className="w-5 h-5" />}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {complaint && (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <span className={`px-4 py-2 rounded-xl font-bold border ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
              <span className="text-sm text-gray-500">ID: {complaint.complaintId}</span>
            </div>

            {complaint.image && (
              <img
                src={getImageUrl(complaint.image)}
                alt="Complaint"
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
            )}

            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-gray-500">Type</p>
                <p className="text-lg font-bold text-gray-900 capitalize">{complaint.complaintType}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-500">Description</p>
                <p className="text-gray-700">{complaint.description}</p>
              </div>

              {complaint.location && (
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-2">Location</p>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span>{complaint.location.latitude.toFixed(4)}, {complaint.location.longitude.toFixed(4)}</span>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-bold text-gray-500 mb-2">Submitted</p>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {complaint.resolvedAt && (
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-2">Resolved</p>
                  <div className="flex items-center gap-2 text-green-700">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(complaint.resolvedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackComplaint