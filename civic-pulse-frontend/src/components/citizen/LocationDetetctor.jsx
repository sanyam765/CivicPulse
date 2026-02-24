import React, { useState } from 'react'
import { MapPin, Loader, Check } from 'lucide-react'

function LocationDetector({ onLocationDetect, latitude, longitude }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [detected, setDetected] = useState(false)

  const detectLocation = () => {
    setLoading(true)
    setError('')
    setDetected(false)

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        onLocationDetect(lat, lng)
        setLoading(false)
        setDetected(true)
        setTimeout(() => setDetected(false), 3000)
      },
      (err) => {
        setError('Unable to detect location. Please enable location access.')
        setLoading(false)
        console.error(err)
      }
    )
  }

  return (
    <div className="group">
      <label className="flex items-center space-x-2 text-sm font-black text-gray-700 mb-4 uppercase tracking-wide">
        <MapPin className="w-4 h-4 text-primary-600" />
        <span>Location</span>
        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs font-bold">Optional</span>
      </label>
      
      <div className="flex space-x-3">
        <div className="flex-1 relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-12 pr-4 py-5 text-lg border-2 border-gray-200 rounded-2xl bg-gray-50 font-mono font-semibold text-gray-700"
            placeholder="GPS coordinates will appear here..."
            value={latitude && longitude ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` : ''}
            readOnly
          />
          {detected && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <Check className="w-6 h-6 text-green-500 animate-bounce" />
            </div>
          )}
        </div>
        
        <button
          type="button"
          onClick={detectLocation}
          disabled={loading}
          className={`px-8 py-5 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center space-x-3 ${
            loading
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : detected
              ? 'bg-green-500 text-white shadow-lg'
              : 'glass border-2 border-primary-300 text-primary-700 hover:shadow-xl hover:scale-105 hover:border-primary-500'
          }`}
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Detecting...</span>
            </>
          ) : detected ? (
            <>
              <Check className="w-5 h-5" />
              <span>Detected!</span>
            </>
          ) : (
            <>
              <MapPin className="w-5 h-5" />
              <span>Detect Location</span>
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="mt-3 flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-xl animate-slide-up">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold text-sm">{error}</span>
        </div>
      )}

      <p className="mt-3 text-sm text-gray-600 flex items-center space-x-2">
        <span>💡</span>
        <span>Auto-detect your location or describe it in the complaint description</span>
      </p>
    </div>
  )
}

export default LocationDetector