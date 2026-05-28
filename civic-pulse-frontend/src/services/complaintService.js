

import api from '../api/axios'


export const createComplaint = async (complaintData) => {
  try {
  
    const formData = new FormData()

   
    formData.append('complaintType', complaintData.complaintType)
    formData.append('description', complaintData.description)


    if (complaintData.location) {
      formData.append('location', JSON.stringify(complaintData.location))
    }

    if (complaintData.image) {
      formData.append('image', complaintData.image)
    }

    // Make POST request
    const response = await api.post('/complaints', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data

  } catch (error) {
    const message = error.response?.data?.message || 'Failed to submit complaint'
    throw new Error(message)
  }
}


export const getAllComplaints = async () => {
  try {
    const response = await api.get('/complaints')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch complaints'
    throw new Error(message)
  }
}

export const getMyComplaints = async () => {
  try {
    const response = await api.get('/complaints/mine')
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch your complaints'
    throw new Error(message)
  }
}


export const getComplaintById = async (complaintId) => {
  try {
    const response = await api.get(`/complaints/${complaintId}`)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Complaint not found'
    throw new Error(message)
  }
}


export const updateComplaint = async (complaintId, updateData) => {
  try {
    const response = await api.put(`/complaints/${complaintId}`, updateData)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update complaint'
    throw new Error(message)
  }
}


export const deleteComplaint = async (complaintId) => {
  try {
    const response = await api.delete(`/complaints/${complaintId}`)
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete complaint'
    throw new Error(message)
  }
}