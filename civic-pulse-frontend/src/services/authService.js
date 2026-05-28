

import api from '../api/axios'


export const register = async (userData) => {
  try {
    
    const response = await api.post('/auth/register', userData)



    return response.data

  } catch (error) {
    // Extract error message from backend response
    const message = error.response?.data?.message || 'Registration failed'
    throw new Error(message)
  }
}


export const login = async (credentials) => {
  try {
  
    const response = await api.post('/auth/login', credentials)

  
    return response.data

  } catch (error) {
    const message = error.response?.data?.message || 'Login failed'
    throw new Error(message)
  }
}


export const getCurrentUser = async () => {
  try {

    const response = await api.get('/auth/me')

    return response.data

  } catch (error) {
    const message = error.response?.data?.message || 'Failed to get user'
    throw new Error(message)
  }
}


export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to send reset link'
    throw new Error(message)
  }
}


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


export const logout = () => {

  localStorage.removeItem('token')
  localStorage.removeItem('user')

}

