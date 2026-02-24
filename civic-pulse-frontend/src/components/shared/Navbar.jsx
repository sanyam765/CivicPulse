import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Search, FileText, Shield, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function Navbar() {
  const location = useLocation()
  const { isAuthenticated, admin, logout } = useAuth()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isLoginPage = location.pathname === '/admin/login'

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-500 text-white p-2 rounded-lg">
              <Shield className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold text-primary-800">
              Civic Pulse
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {!isAdminRoute ? (
              // Citizen Navigation
              <>
                <NavLink to="/" icon={<Home className="w-4 h-4" />} text="Submit" />
                <NavLink to="/track" icon={<Search className="w-4 h-4" />} text="Track" />
                <NavLink to="/my-complaints" icon={<FileText className="w-4 h-4" />} text="My Complaints" />
                
                {!isAuthenticated && (
                  <Link
                    to="/admin/login"
                    className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium"
                  >
                    Admin Login
                  </Link>
                )}
              </>
            ) : (
              // Admin Navigation
              <>
                {isAuthenticated && !isLoginPage ? (
                  // Show when logged in AND not on login page
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                      Welcome, <span className="font-semibold text-primary-700">{admin.name}</span>
                    </div>
                    <button
                      onClick={logout}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                    <Link
                      to="/"
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                    >
                      Exit Admin
                    </Link>
                  </div>
                ) : isLoginPage ? (
                  // Show on login page
                  <Link
                    to="/"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                  >
                    Back to Home
                  </Link>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

// Helper component for navigation links
function NavLink({ to, icon, text }) {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link
      to={to}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        isActive
          ? 'bg-primary-100 text-primary-700'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{text}</span>
    </Link>
  )
}

export default Navbar