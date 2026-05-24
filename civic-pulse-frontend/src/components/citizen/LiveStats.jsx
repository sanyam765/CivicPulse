import React, { useState, useEffect } from 'react'
import { TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { getAllComplaints } from '../../services/complaintService'

const getResolutionHours = (complaint) => {
  if (!complaint?.createdAt || !complaint?.resolvedAt) return null

  const created = new Date(complaint.createdAt)
  const resolved = new Date(complaint.resolvedAt)
  const diffMs = resolved - created

  return Number.isFinite(diffMs) && diffMs >= 0 ? diffMs / (1000 * 60 * 60) : null
}

const buildLiveStats = (complaints) => {
  const resolved = complaints.filter(c => c.status === 'Resolved').length
  const pending = complaints.filter(c => c.status === 'Pending').length
  const inProgress = complaints.filter(c => c.status === 'In Progress').length

  const resolvedHours = complaints
    .map(getResolutionHours)
    .filter(hours => hours !== null)

  const avgTime = resolvedHours.length > 0
    ? Math.round(resolvedHours.reduce((sum, hours) => sum + hours, 0) / resolvedHours.length)
    : 0

  return {
    total: complaints.length,
    resolved,
    pending,
    inProgress,
    avgTime
  }
}

function LiveStats() {
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    inProgress: 0,
    avgTime: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      const response = await getAllComplaints()
      const complaints = response.data.complaints

      // This card is now driven by the same complaint feed as the rest of the dashboard.
      setStats(buildLiveStats(complaints))
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: "Total Complaints",
      value: stats.total.toLocaleString(),
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-50",
      textColor: "text-blue-700"
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      label: "Resolved",
      value: stats.resolved.toLocaleString(),
      color: "from-green-500 to-green-600",
      bg: "bg-green-50",
      textColor: "text-green-700"
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      label: "In Progress",
      value: stats.inProgress.toLocaleString(),
      color: "from-orange-500 to-orange-600",
      bg: "bg-orange-50",
      textColor: "text-orange-700"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: "Avg Response",
      value: `${stats.avgTime}h`,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-50",
      textColor: "text-purple-700"
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 via-white to-green-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-md mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-700">Live Statistics</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-800">
            Real Impact, <span className="gradient-text">Real Numbers</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="card p-6 text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${stat.color} text-white rounded-xl shadow-lg mb-4`}>
                {stat.icon}
              </div>
              <div className={`text-3xl font-bold ${stat.textColor} mb-2`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LiveStats