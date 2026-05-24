import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute({ children, adminOnly = true }) {
  const { isAuthenticated, admin, loading } = useAuth()

  // Show loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  // Logged in but NOT admin → redirect to home
  if (adminOnly && admin?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  // All checks passed
  return children
}

export default ProtectedRoute