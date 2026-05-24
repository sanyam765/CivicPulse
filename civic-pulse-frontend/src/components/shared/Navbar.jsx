import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function Navbar() {
  const location = useLocation()
  const { isAuthenticated, admin, logout } = useAuth()

  // Helper: Check if link is active
  const isActive = (path) => location.pathname === path

  // ═══════════════════════════════════════════════════════════
  // ADMIN NAVBAR - Only for logged-in admins
  // ═══════════════════════════════════════════════════════════
  if (isAuthenticated && admin?.role === 'admin') {
    // Admin should ONLY see admin dashboard
    // NO navbar needed - they use sidebar
    return null  // Don't render navbar for admin
  }

  // ═══════════════════════════════════════════════════════════
  // CITIZEN/PUBLIC NAVBAR
  // ═══════════════════════════════════════════════════════════
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">CP</span>
            </div>
            <span className="text-xl font-black text-gray-900">CivicPulse</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className={`font-bold transition-colors ${
                isActive('/') ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              Home
            </Link>

            <Link
              to="/how-it-works"
              className={`font-bold transition-colors ${
                isActive('/how-it-works') ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              How it Works
            </Link>

            <Link
              to="/report-issue"
              className={`font-bold transition-colors ${
                isActive('/report-issue') ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              Report Issue
            </Link>

            <Link
              to="/track"
              className={`font-bold transition-colors ${
                isActive('/track') ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              Track Issue
            </Link>

            <Link
              to="/my-complaints"
              className={`font-bold transition-colors ${
                isActive('/my-complaints') ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'
              }`}
            >
              My Complaints
            </Link>

            {/* RIGHT SIDE */}
            {isAuthenticated ? (
              // Logged in as citizen
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {admin?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="font-bold text-gray-900">{admin?.name}</span>
                </div>

                <button
                  onClick={logout}
                  className="px-5 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Not logged in (anonymous/public)
              <Link
                to="/admin/login"
                className="px-5 py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar