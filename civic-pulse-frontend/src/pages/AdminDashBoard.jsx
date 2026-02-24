import React from 'react'
import { BarChart3, Clock, CheckCircle, AlertTriangle, FileText } from 'lucide-react'

function AdminDashboard() {
  // Mock statistics (will come from backend later)
  const stats = {
    total: 156,
    pending: 23,
    inProgress: 45,
    resolved: 88,
  }

  // Mock recent complaints
  const recentComplaints = [
    { id: 'CMP-123456', type: 'Pothole', status: 'Pending', priority: 'High' },
    { id: 'CMP-123455', type: 'Streetlight', status: 'In Progress', priority: 'Medium' },
    { id: 'CMP-123454', type: 'Garbage', status: 'Pending', priority: 'Low' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-primary-800 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage and monitor civic complaints
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FileText className="w-8 h-8" />}
            title="Total Complaints"
            value={stats.total}
            color="bg-blue-500"
          />
          <StatCard
            icon={<Clock className="w-8 h-8" />}
            title="Pending"
            value={stats.pending}
            color="bg-yellow-500"
          />
          <StatCard
            icon={<AlertTriangle className="w-8 h-8" />}
            title="In Progress"
            value={stats.inProgress}
            color="bg-orange-500"
          />
          <StatCard
            icon={<CheckCircle className="w-8 h-8" />}
            title="Resolved"
            value={stats.resolved}
            color="bg-green-500"
          />
        </div>

        {/* Recent Complaints Table */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <BarChart3 className="w-6 h-6 text-primary-600 mr-2" />
              Recent Complaints
            </h2>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Priority</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((complaint) => (
                  <tr key={complaint.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{complaint.id}</td>
                    <td className="py-3 px-4">{complaint.type}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-primary-600 hover:text-primary-700 font-medium">
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

// Statistics Card Component
function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`${color} text-white p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

// Helper functions for colors
function getStatusColor(status) {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-700'
    case 'In Progress':
      return 'bg-blue-100 text-blue-700'
    case 'Resolved':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-700'
    case 'Medium':
      return 'bg-orange-100 text-orange-700'
    case 'Low':
      return 'bg-green-100 text-green-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default AdminDashboard