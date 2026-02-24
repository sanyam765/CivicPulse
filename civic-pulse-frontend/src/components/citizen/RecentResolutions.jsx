import React, { useState, useEffect } from 'react'
import { CheckCircle, MapPin, Calendar } from 'lucide-react'

function RecentResolutions() {
  const [recentComplaints, setRecentComplaints] = useState([])

  useEffect(() => {
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]')
    const resolved = complaints
      .filter(c => c.status === 'Resolved')
      .slice(-3)
      .reverse()
    setRecentComplaints(resolved)
  }, [])

  const mockResolutions = [
    {
      complaintId: 'CMP-DEMO001',
      complaintType: 'Pothole',
      description: 'Large pothole on Main Street repaired',
      imagePreview: 'https://images.unsplash.com/photo-1599687351724-dfa3c4ff81e1?w=400',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      complaintId: 'CMP-DEMO002',
      complaintType: 'Streetlight',
      description: 'Non-functional streetlight replaced',
      imagePreview: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      complaintId: 'CMP-DEMO003',
      complaintType: 'Garbage',
      description: 'Garbage collection schedule restored',
      imagePreview: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]

  const displayComplaints = recentComplaints.length > 0 ? recentComplaints : mockResolutions

  if (displayComplaints.length === 0) return null

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
          {displayComplaints.map((complaint, index) => (
            <div 
              key={complaint.complaintId}
              className="card overflow-hidden group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={complaint.imagePreview} 
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