import React from 'react'
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'

function MyComplaints() {
  // Mock data (will come from backend later)
  const mockComplaints = [
    {
      id: 'CMP-123456',
      type: 'Pothole',
      description: 'Large pothole on Main Street near park',
      status: 'In Progress',
      date: '2024-02-10',
    },
    {
      id: 'CMP-123455',
      type: 'Streetlight',
      description: 'Streetlight not working for 3 days',
      status: 'Resolved',
      date: '2024-02-08',
    },
    {
      id: 'CMP-123454',
      type: 'Garbage',
      description: 'Garbage not collected for a week',
      status: 'Pending',
      date: '2024-02-12',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-800 mb-2">
            All Complaints
          </h1>
          <p className="text-lg text-gray-600">
            View all submitted complaints and their current status
          </p>
        </div>

        {/* Complaints Grid */}
        <div className="grid gap-6">
          {mockComplaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Complaint Card Component
function ComplaintCard({ complaint }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-5 h-5" />
      case 'In Progress':
        return <AlertCircle className="w-5 h-5" />
      case 'Resolved':
        return <CheckCircle className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'In Progress':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'Resolved':
        return 'bg-green-100 text-green-700 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-800">
              {complaint.type}
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${getStatusColor(complaint.status)}`}>
              {getStatusIcon(complaint.status)}
              <span>{complaint.status}</span>
            </span>
          </div>
          <p className="text-sm text-gray-500 font-mono">{complaint.id}</p>
        </div>
        <div className="text-right text-sm text-gray-500">
          {new Date(complaint.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
      </div>
      <p className="text-gray-600">{complaint.description}</p>
    </div>
  )
}

export default MyComplaints