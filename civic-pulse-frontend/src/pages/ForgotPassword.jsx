import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { forgotPassword } from '../services/authService'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await forgotPassword(email)
      setSuccess(true)
      
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 mb-4">
              Check Your Email!
            </h2>
            
            <p className="text-gray-600 mb-8">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>

            <Link
              to="/login"
              className="block w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-emerald-600 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>

          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600 mb-8">
            No worries! Enter your email and we'll send you reset instructions.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@civicpulse.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-200"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword