import React, { useState } from 'react'
import { Search } from 'lucide-react'

function TrackComplaint() {
  const [complaintId, setComplaintId] = useState('')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-800 mb-4">
            Track Your Complaint
          </h1>
          <p className="text-lg text-gray-600">
            Enter your complaint ID to check the current status
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex space-x-3">
            <input
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
              placeholder="Enter Complaint ID (e.g., CMP-123456)"
            />
            <button className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold flex items-center">
              <Search className="w-5 h-5 mr-2" />
              Track
            </button>
          </div>
        </div>

        {/* Example Result (will be dynamic later) */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center text-gray-400 py-12">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Enter a complaint ID to see tracking details</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackComplaint