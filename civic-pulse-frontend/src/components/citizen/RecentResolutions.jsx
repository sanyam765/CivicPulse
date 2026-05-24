import React, { useState, useEffect } from 'react'
import { CheckCircle, MapPin, Calendar } from 'lucide-react'
import { getAllComplaints } from '../../services/complaintService'

const getImageUrl = (imagePath) => {
  if (!imagePath) return 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400'
  if (imagePath.startsWith('http')) return imagePath
  return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`
}

function RecentResolutions() {
  const [recentComplaints, setRecentComplaints] = useState([])

  useEffect(() => {
    const fetchResolved = async () => {
      const response = await getAllComplaints()
      const complaints = response.data.complaints
      const resolved = complaints
        .filter(c => c.status === 'Resolved')
        .slice(0, 3)
      setRecentComplaints(resolved)
    }

    fetchResolved()
  }, [])

  if (recentComplaints.length === 0) return null

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Recent <span className="gradient-text">Success Stories</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how we're making a difference in our community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {recentComplaints.map((complaint, index) => (
            <div
              key={complaint.complaintId}
              className="card overflow-hidden group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getImageUrl(complaint.image)}
                  alt={complaint.complaintType}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span>Resolved</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-gray-500">
                    {complaint.complaintId}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {complaint.complaintType}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {complaint.description}
                </p>

                <div className="flex items-center text-xs text-green-600 font-semibold">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Resolved in {Math.ceil((new Date(complaint.resolvedAt || complaint.createdAt) - new Date(complaint.createdAt)) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecentResolutions