import React, { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check if user is already logged in (on page load)
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const adminData = localStorage.getItem('adminData')
    
    if (token && adminData) {
      setIsAuthenticated(true)
      setAdmin(JSON.parse(adminData))
    }
    setLoading(false)
  }, [])

  // Login function
  const login = (email, password) => {
    // Mock authentication (will connect to backend later)
    if (email === 'admin@test.com' && password === 'password123') {
      const mockAdmin = {
        id: '1',
        name: 'Admin User',
        email: email,
        department: 'Municipal Services'
      }
      
      // Store in localStorage
      localStorage.setItem('adminToken', 'mock-jwt-token-12345')
      localStorage.setItem('adminData', JSON.stringify(mockAdmin))
      
      setIsAuthenticated(true)
      setAdmin(mockAdmin)
      navigate('/admin/dashboard')
      
      return { success: true }
    } else {
      return { success: false, message: 'Invalid credentials' }
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminData')
    setIsAuthenticated(false)
    setAdmin(null)
    navigate('/admin/login')
  }

  const value = {
    isAuthenticated,
    admin,
    login,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}