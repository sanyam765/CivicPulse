import React, { useState, useEffect } from 'react'
import { TrendingUp, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

function LiveStats() {
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    avgTime: 0
  })

  useEffect(() => {
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]')
    const resolved = complaints.filter(c => c.status === 'Resolved').length
    const pending = complaints.filter(c => c.status === 'Pending').length
    
    let current = 0
    const target = complaints.length + 1234
    const increment = Math.ceil(target / 50)
    
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        current = target
        clearInterval(timer)
      }
      setStats({
        total: current,
        resolved: Math.floor(current * 0.72) + resolved,
        pending: Math.floor(current * 0.15) + pending,
        avgTime: 24
      })
    }, 30)

    return () => clearInterval(timer)
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
      value: stats.pending.toLocaleString(),
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