import React, { useState } from 'react'
import { Upload, X } from 'lucide-react'

function ImageUpload({ onImageSelect }) {
  const [preview, setPreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
      // Pass BOTH file object AND preview to parent
      onImageSelect(file, reader.result)
      //             ↑          ↑
      //          File obj   Base64 preview
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onImageSelect(null, null)
  }

  return (
    <div>
      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-emerald-500 bg-emerald-50'
              : 'border-gray-300 hover:border-emerald-400'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-gray-400 mt-2">
              PNG, JPG, GIF up to 5MB
            </p>
          </label>
        </div>
      ) : (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-xl"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default ImageUpload