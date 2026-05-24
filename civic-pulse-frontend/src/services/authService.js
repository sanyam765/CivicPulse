// ═══════════════════════════════════════════════════════════
// AUTHENTICATION SERVICE
// All API calls related to authentication
// ═══════════════════════════════════════════════════════════

import api from '../api/axios'

// ───────────────────────────────────────────────────────────
// REGISTER NEW USER
// ───────────────────────────────────────────────────────────
export const register = async (userData) => {
  try {
    // Make POST request to /api/auth/register
    const response = await api.post('/auth/register', userData)



    return response.data

  } catch (error) {
    // Extract error message from backend response
    const message = error.response?.data?.message || 'Registration failed'
    throw new Error(message)
  }
}

// WHY THROW ERROR?
// So the calling component can catch it:
// try {
//   await register(data)
// } catch (error) {
//   alert(error.message)  // Shows: "User already exists"
// }

// ───────────────────────────────────────────────────────────
// LOGIN USER
// ───────────────────────────────────────────────────────────
export const login = async (credentials) => {
  try {
    // Make POST request to /api/auth/login
    const response = await api.post('/auth/login', credentials)

    // Return the data from backend
    return response.data

  } catch (error) {
    const message = error.response?.data?.message || 'Login failed'
    throw new Error(message)
  }
}

// ───────────────────────────────────────────────────────────
// GET CURRENT USER (Protected route)
// ───────────────────────────────────────────────────────────
export const getCurrentUser = async () => {
  try {
    // Make GET request to /api/auth/me
    // Token is automatically added by axios interceptor!
    const response = await api.get('/auth/me')

    return response.data

  } catch (error) {
    const message = error.response?.data?.message || 'Failed to get user'
    throw new Error(message)
  }
}

// ───────────────────────────────────────────────────────────
// FORGOT PASSWORD
// ───────────────────────────────────────────────────────────
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to send reset link'
    throw new Error(message)
  }
}

// ───────────────────────────────────────────────────────────
// RESET PASSWORD
// ───────────────────────────────────────────────────────────
export const resetPassword = async (token, password, confirmPassword) => {
  try {
    const response = await api.put(`/auth/reset-password/${token}`, {
      password,
      confirmPassword
    })
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to reset password'
    throw new Error(message)
  }
}

// ───────────────────────────────────────────────────────────
// LOGOUT USER (Client-side only)
// ───────────────────────────────────────────────────────────
export const logout = () => {
  // Remove token and user data from localStorage
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  // Optionally, you could call backend to invalidate token
  // But with JWT, we just remove it client-side
}

// WHY NO API CALL FOR LOGOUT?
// JWT is stateless - server doesn't store sessions
// Just removing token from client is enough
//
// Some apps DO call backend to:
// - Add token to blacklist
// - Log logout event
// - Update last active time