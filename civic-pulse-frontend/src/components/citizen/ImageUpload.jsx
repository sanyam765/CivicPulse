import React, { useState } from 'react'
import { Camera, X, Upload, Image as ImageIcon } from 'lucide-react'

function ImageUpload({ onImageSelect, selectedImage }) {
  const [preview, setPreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    processFile(file)
  }

  const processFile = (file) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, JPEG)')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
      onImageSelect(file, reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onImageSelect(null, null)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="group">
      <label className="flex items-center space-x-2 text-sm font-black text-gray-700 mb-4 uppercase tracking-wide">
        <Camera className="w-4 h-4 text-primary-600" />
        <span>Upload Image</span>
        <span className="text-red-500">*</span>
        <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-bold">Required</span>
      </label>
      
      {!preview ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-3 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group-hover:border-primary-400 ${
            dragActive 
              ? 'border-primary-500 bg-primary-50 scale-105' 
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          }`}
        >
          <input 
            type="file" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          
          <div className="pointer-events-none">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-green-500 rounded-2xl shadow-xl mb-6 group-hover:scale-110 transition-transform">
              <Camera className="w-10 h-10 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {dragActive ? 'Drop your image here' : 'Upload Complaint Photo'}
            </h3>
            
            <p className="text-gray-600 mb-4">
              Click to browse or drag and drop your image
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <ImageIcon className="w-4 h-4" />
                <span>PNG, JPG</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center space-x-1">
                <Upload className="w-4 h-4" />
                <span>Max 5MB</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl group/preview">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-80 object-cover"
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all transform hover:scale-110 font-bold flex items-center space-x-2 shadow-xl"
            >
              <X className="w-5 h-5" />
              <span>Remove Image</span>
            </button>
          </div>

          {/* Remove button (always visible on mobile) */}
          <button
            type="button"
            onClick={handleRemove}
            className="md:hidden absolute top-4 right-4 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all shadow-xl"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Success badge */}
          <div className="absolute top-4 left-4 glass px-4 py-2 rounded-full flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-bold text-gray-700">Image Ready</span>
          </div>
        </div>
      )}

      <p className="mt-3 text-sm text-gray-600 flex items-center space-x-2">
        <span>📸</span>
        <span>Clear photo helps resolve issues faster - capture the problem from multiple angles if possible</span>
      </p>
    </div>
  )
}

export default ImageUpload