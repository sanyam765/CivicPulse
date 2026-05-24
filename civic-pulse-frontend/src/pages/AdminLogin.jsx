import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'

function AdminLogin() {
  const { login, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated && admin?.role === 'admin') {

      navigate('/admin/dashboard', { replace: true })
    }
  }, [isAuthenticated, admin, navigate])




  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

    if (error) setError('')
  }



  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {

      if (!formData.email || !formData.password) {
        setError('Please fill in all fields')
        setLoading(false)
        return
      }

      const result = await login(formData.email, formData.password)

      if (!result.success) {
        setError(result.message || 'Login failed')
      }


    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }



  const handleDemoLogin = () => {
    setFormData({
      email: 'admin@civicpulse.com',
      password: 'admin123'
    })
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-gray-900 mb-2">
              Admin Login
            </h1>
            <p className="text-gray-500">
              Sign in to access the dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@civicpulse.com"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div></div>
              <Link
                to="/forgot-password"
                className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-emerald-200 hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-200"
            >
              Use Demo Credentials
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Demo: admin@civicpulse.com / admin123
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin