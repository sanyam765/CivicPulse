


import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || 'https://civic-pulse-backend-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})

// ... rest of your interceptors

// WHY CREATE AN INSTANCE?
// Instead of writing full URL every time:
// axios.post('http://localhost:5000/api/auth/login', ...)
//
// We can write:
// api.post('/auth/login', ...)
//
// Benefits:
// 1. Don't repeat base URL
// 2. Easy to change URL (dev vs production)
// 3. Centralized configuration

// ───────────────────────────────────────────────────────────
// REQUEST INTERCEPTOR
// Runs BEFORE every request is sent
// ───────────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    
    if (import.meta.env.DEV) {
      console.log('📤 API Request:', config.method.toUpperCase(), config.url)
    }

    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)



api.interceptors.response.use(
  (response) => {
   
    console.log('📥 API Response:', response.config.url, response.status)

 
    return response
  },
  (error) => {
    // Handle errors globally
    console.error('❌ API Error:', error.response?.data?.message || error.message)

  
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

    }

    return Promise.reject(error)
  }
)


export default api