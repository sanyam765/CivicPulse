import React, { useState, useEffect } from 'react'
import { getMyComplaints } from '../services/complaintService'
import { Calendar, MapPin } from 'lucide-react'

const getImageUrl = (imagePath) => {
  if (!imagePath) return null
  if (imagePath.startsWith('http')) return imagePath
  return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`
}

function MyComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch complaints on component mount
  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const response = await getMyComplaints()
      setComplaints(response.data.complaints)
    } catch (error) {
      setError(error.message || 'Failed to load complaints')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-100 text-amber-700'
      case 'In Progress': return 'bg-blue-100 text-blue-700'
      case 'Resolved': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading complaints...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-20 pb-10 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <h1 className="text-5xl font-black text-gray-900 mb-4">All Complaints</h1>
        <p className="text-xl text-gray-600 mb-8">
          Total: {complaints.length} complaints
        </p>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Complaints Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
              
              {/* Image */}
              {complaint.image && (
                <img
                  src={getImageUrl(complaint.image)}
                  alt="Complaint"
                  className="w-full h-48 object-cover"
                />
              )}

              {/* Content */}
              <div className="p-6">
                
                {/* Status */}
                <span className={`inline-block px-3 py-1 rounded-lg text-sm font-bold mb-3 ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>

                {/* Type */}
                <h3 className="text-xl font-black text-gray-900 mb-2 capitalize">
                  {complaint.complaintType}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {complaint.description}
                </p>

                {/* Meta */}
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {complaint.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs">
                        {complaint.location.latitude.toFixed(2)}, {complaint.location.longitude.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* ID */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-400">ID: {complaint.complaintId}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {complaints.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-2xl font-bold text-gray-400">No complaints yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyComplaints