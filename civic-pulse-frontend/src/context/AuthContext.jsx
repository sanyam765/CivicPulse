

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginService, logout as logoutService, getCurrentUser } from '../services/authService'

const AuthContext = createContext()


export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)  // Add loading state
  const navigate = useNavigate()


  const syncAuth = useCallback(async ({ withLoading = false } = {}) => {
    if (withLoading) setLoading(true)

    const token = localStorage.getItem('token')

    if (!token) {
      setIsAuthenticated(false)
      setAdmin(null)
      if (withLoading) setLoading(false)
      return
    }

    try {
      const response = await getCurrentUser()
      const user = response.data.user

      setAdmin(user)
      setIsAuthenticated(true)

    
      localStorage.setItem('user', JSON.stringify(user))
    } catch (error) {
      console.error('Token validation failed:', error.message)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setIsAuthenticated(false)
      setAdmin(null)
    } finally {
      if (withLoading) setLoading(false)
    }
  }, [])


  useEffect(() => {
    syncAuth({ withLoading: true })
  }, [syncAuth])


  useEffect(() => {
    const intervalId = setInterval(() => {
      if (document.visibilityState === 'visible') {
        syncAuth()
      }
    }, 15000)

    const handleWindowFocus = () => {
      syncAuth()
    }

    const handleStorageChange = (event) => {
      if (event.key === 'token' || event.key === 'user') {
        syncAuth()
      }
    }

    window.addEventListener('focus', handleWindowFocus)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('focus', handleWindowFocus)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [syncAuth])


  const login = async (email, password) => {
    try {
      // Call backend API
      const response = await loginService({ email, password })



      const { user, token } = response.data

    
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // Update state
      setAdmin(user)
      setIsAuthenticated(true)

      // Navigate to dashboard
      navigate('/admin/dashboard')

      return { success: true }

    } catch (error) {
      console.error('Login error:', error.message)
      return {
        success: false,
        message: error.message
      }
    }
  }

  // ─────────────────────────────────────────────────────────
  // LOGOUT FUNCTION
  // ─────────────────────────────────────────────────────────
  const logout = () => {
    // Clear localStorage
    logoutService()

    // Clear state
    setAdmin(null)
    setIsAuthenticated(false)

    // Navigate to login
    navigate('/admin/login')
  }

  // ─────────────────────────────────────────────────────────
  // PROVIDE VALUES TO ALL CHILDREN
  // ─────────────────────────────────────────────────────────
  const value = {
    isAuthenticated,
    admin,
    loading,  // Expose loading state
    refreshAuth: syncAuth,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// ───────────────────────────────────────────────────────────
// CUSTOM HOOK TO USE AUTH CONTEXT
// ───────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}