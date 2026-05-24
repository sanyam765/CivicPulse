import React from 'react'
import { CheckCircle, Copy, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function SuccessModal({ isOpen, complaintId, onClose }) {
  const navigate = useNavigate()

  if (isOpen === false || !complaintId) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(complaintId)
    alert('Complaint ID copied!')
  }

  const handleTrackComplaint = () => {
    // Navigate to track page with complaint ID in URL hash for auto-search
    navigator.clipboard.writeText(complaintId)
    navigate(`/citizen/track#${complaintId}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full">
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Complaint Submitted!</h2>
          <p className="text-gray-600">Your complaint has been registered</p>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-emerald-700 font-bold mb-2">Your Complaint ID</p>
          <div className="flex items-center justify-between">
            <p className="text-xl font-black text-emerald-900">{complaintId}</p>
            <button onClick={handleCopy} className="p-2 hover:bg-emerald-100 rounded-lg">
              <Copy className="w-5 h-5 text-emerald-600" />
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600">💡 ID copied to clipboard. Paste it in the Track page.</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleTrackComplaint}
            className="w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600"
          >
            Track Complaint
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200"
          >
            Submit Another
          </button>
        </div>
      </div>
    </div>
  )
}

export default SuccessModal