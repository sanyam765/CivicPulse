


import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || 'https://civic-pulse-backend-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})


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