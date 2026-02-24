import React from 'react'
import { CheckCircle, X, Copy } from 'lucide-react'

function SuccessModal({ isOpen, onClose, complaintId }) {
  if (!isOpen) return null

  const copyToClipboard = () => {
    navigator.clipboard.writeText(complaintId)
    alert('Complaint ID copied to clipboard!')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 relative animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Complaint Submitted Successfully!
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Your complaint has been registered. Save your tracking ID below.
        </p>

        {/* Complaint ID Box */}
        <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2 text-center">Your Complaint ID</p>
          <div className="flex items-center justify-between bg-white rounded-lg p-3">
            <code className="text-lg font-bold text-primary-700">{complaintId}</code>
            <button
              onClick={copyToClipboard}
              className="ml-4 p-2 bg-primary-100 text-primary-700 rounded hover:bg-primary-200"
              title="Copy to clipboard"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => {
              onClose()
              window.location.href = '/track'
            }}
            className="flex-1 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
          >
            Track Complaint
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
          >
            Submit Another
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessModal