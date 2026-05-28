import React, { useState, useEffect } from 'react'
import AdminHeader from '../components/admin/AdminHeader'
import { getAllComplaints, updateComplaint, deleteComplaint } from '../services/complaintService'
import { Trash2, Eye } from 'lucide-react'

function AdminDashboard() {
  const [complaints, setComplaints] = useState([])
  const [filteredComplaints, setFilteredComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    resolvedToday: 0,
    avgResolutionTime: '0h'
  })

  const notifications = complaints.slice(0, 6).map((complaint) => ({
    id: complaint.complaintId,
    message: `${complaint.complaintType} complaint is ${complaint.status}`,
    time: new Date(complaint.updatedAt || complaint.createdAt).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    }),
    unread: complaint.status !== 'Resolved'
  }))

  useEffect(() => {
    fetchComplaints()
    const interval = setInterval(fetchComplaints, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  // Filter complaints when search or filter changes
  useEffect(() => {
    let filtered = complaints

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus)
    }

    setFilteredComplaints(filtered)
  }, [complaints, filterStatus])

  const fetchComplaints = async () => {
    try {
      const response = await getAllComplaints()
      const data = response.data.complaints
      
      setComplaints(data)
      setFilteredComplaints(data)
      
      // Calculate stats (same as before)
      const pending = data.filter(c => c.status === 'Pending').length
      const inProgress = data.filter(c => c.status === 'In Progress').length
      const resolved = data.filter(c => c.status === 'Resolved').length
      
      const today = new Date().setHours(0, 0, 0, 0)
      const resolvedToday = data.filter(c => {
        if (!c.resolvedAt) return false
        return new Date(c.resolvedAt).setHours(0, 0, 0, 0) === today
      }).length
      
      const resolvedComplaints = data.filter(c => c.resolvedAt)
      let avgTime = 0
      if (resolvedComplaints.length > 0) {
        const totalTime = resolvedComplaints.reduce((sum, c) => {
          const created = new Date(c.createdAt)
          const resolved = new Date(c.resolvedAt)
          return sum + (resolved - created)
        }, 0)
        avgTime = totalTime / resolvedComplaints.length
        avgTime = Math.round(avgTime / (1000 * 60 * 60))
      }
      
      setStats({
        total: data.length,
        pending,
        inProgress,
        resolved,
        resolvedToday,
        avgResolutionTime: `${avgTime}h`
      })
      
    } catch (error) {
      console.error('Failed to fetch complaints:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle status update
  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await updateComplaint(complaintId, { status: newStatus })
      
      // Update local state immediately for instant UI feedback
      setComplaints(prev => prev.map(c => 
        c.complaintId === complaintId 
          ? { ...c, status: newStatus, resolvedAt: newStatus === 'Resolved' ? new Date() : c.resolvedAt }
          : c
      ))
      
      // Show success feedback
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50'
      notification.textContent = '✓ Status updated successfully!'
      document.body.appendChild(notification)
      setTimeout(() => notification.remove(), 3000)
      
      // Refresh from backend to ensure sync
      setTimeout(fetchComplaints, 1000)
      
    } catch (error) {
      alert('Failed to update status: ' + error.message)
    }
  }

  // Handle delete
  const handleDelete = async (complaintId) => {
    if (!confirm('Are you sure you want to delete this complaint? This action cannot be undone.')) return
    
    try {
      await deleteComplaint(complaintId)
      
      // Remove from local state
      setComplaints(prev => prev.filter(c => c.complaintId !== complaintId))
      
      // Show success feedback
      const notification = document.createElement('div')
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50'
      notification.textContent = '✓ Complaint deleted!'
      document.body.appendChild(notification)
      setTimeout(() => notification.remove(), 3000)
      
    } catch (error) {
      alert('Failed to delete: ' + error.message)
    }
  }

  // View complaint details
  const handleViewDetails = (complaint) => {
    setSelectedComplaint(complaint)
  }

  const handleNotificationClick = (notification) => {
    const match = complaints.find(c => c.complaintId === notification.id)
    if (match) {
      setSelectedComplaint(match)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white border-r">
        {/* Sidebar */}
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader
          notificationCount={notifications.filter(n => n.unread).length}
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
        />

        <div className="flex-1 overflow-auto">
          <div className="p-8">

            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Good afternoon • {new Date().toLocaleDateString()}</p>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-emerald-500">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-gray-500">Total Complaints</p>
                  <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">● LIVE</span>
                </div>
                <p className="text-4xl font-black text-gray-900">{stats.total}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-amber-500">
                <p className="text-sm font-bold text-gray-500 mb-2">Pending Review</p>
                <p className="text-4xl font-black text-gray-900">{stats.pending}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500">
                <p className="text-sm font-bold text-gray-500 mb-2">Resolved Today</p>
                <p className="text-4xl font-black text-gray-900">{stats.resolvedToday}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-blue-500">
                <p className="text-sm font-bold text-gray-500 mb-2">Avg Resolution</p>
                <p className="text-4xl font-black text-gray-900">{stats.avgResolutionTime}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    filterStatus === 'all'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({complaints.length})
                </button>
                <button
                  onClick={() => setFilterStatus('Pending')}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    filterStatus === 'Pending'
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Pending ({stats.pending})
                </button>
                <button
                  onClick={() => setFilterStatus('In Progress')}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    filterStatus === 'In Progress'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  In Progress ({stats.inProgress})
                </button>
                <button
                  onClick={() => setFilterStatus('Resolved')}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    filterStatus === 'Resolved'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Resolved ({stats.resolved})
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
              <table className="w-full min-w-max">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold text-gray-900">ID</th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold text-gray-900">Type</th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold text-gray-900">Description</th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold text-gray-900">Date</th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold text-gray-900">Status</th>
                    <th className="px-3 sm:px-6 py-4 text-left text-xs sm:text-sm font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint._id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm text-gray-600 font-mono">
                        {complaint.complaintId.substring(0, 12)}...
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-gray-100 rounded-lg text-sm font-medium capitalize">
                          {complaint.complaintType}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        <div className="truncate">{complaint.description}</div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">
                        <select
                          value={complaint.status}
                          onChange={(e) => handleStatusUpdate(complaint.complaintId, e.target.value)}
                          className={`px-3 py-2 rounded-lg border-2 font-bold text-sm cursor-pointer transition-all ${
                            complaint.status === 'Pending' ? 'border-amber-300 bg-amber-50 text-amber-700' :
                            complaint.status === 'In Progress' ? 'border-blue-300 bg-blue-50 text-blue-700' :
                            'border-green-300 bg-green-50 text-green-700'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(complaint)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-all group"
                            title="View details"
                          >
                            <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(complaint.complaintId)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-all group"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredComplaints.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 font-medium">No complaints found</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedComplaint(null)}
              className="float-right p-2 hover:bg-gray-100 rounded-full"
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Complaint Details</h2>
              <p className="text-sm text-gray-500">ID: {selectedComplaint.complaintId}</p>
            </div>

            {/* Image */}
            {selectedComplaint.image && (
              <img
                src={selectedComplaint.image.startsWith('http') ? selectedComplaint.image : `${import.meta.env.REACT_APP_API_URL?.replace('/api', '') || 'https://civic-pulse-backend-production.up.railway.app'}/${selectedComplaint.image.replace(/\\/g, '/')}`}
                alt="Complaint"
                className="w-full h-64 object-cover rounded-xl mb-6"
              />
            )}

            {/* Details */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold text-gray-500 mb-1">Type</p>
                <p className="text-lg font-bold text-gray-900 capitalize">{selectedComplaint.complaintType}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-500 mb-1">Description</p>
                <p className="text-gray-700">{selectedComplaint.description}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-500 mb-1">Status</p>
                <span className={`inline-block px-4 py-2 rounded-lg font-bold ${
                  selectedComplaint.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                  selectedComplaint.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {selectedComplaint.status}
                </span>
              </div>

              {selectedComplaint.location && (
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-1">Location</p>
                  <p className="text-gray-700">
                    📍 {selectedComplaint.location.latitude.toFixed(6)}, {selectedComplaint.location.longitude.toFixed(6)}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-bold text-gray-500 mb-1">Submitted</p>
                  <p className="text-gray-700">{new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                </div>
                
                {selectedComplaint.resolvedAt && (
                  <div>
                    <p className="text-sm font-bold text-gray-500 mb-1">Resolved</p>
                    <p className="text-green-700">{new Date(selectedComplaint.resolvedAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t flex gap-3">
              <select
                value={selectedComplaint.status}
                onChange={(e) => {
                  handleStatusUpdate(selectedComplaint.complaintId, e.target.value)
                  setSelectedComplaint({ ...selectedComplaint, status: e.target.value })
                }}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-bold"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
              <button
                onClick={() => {
                  handleDelete(selectedComplaint.complaintId)
                  setSelectedComplaint(null)
                }}
                className="px-6 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard