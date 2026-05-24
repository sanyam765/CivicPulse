import api from '../api/axios'

export const getSystemStats = async () => {
  try {
    const response = await api.get('/complaints')
    const complaints = response.data.data.complaints

    // Calculate statistics
    const total = complaints.length
    const resolved = complaints.filter(c => c.status === 'Resolved').length
    const pending = complaints.filter(c => c.status === 'Pending').length
    const inProgress = complaints.filter(c => c.status === 'In Progress').length

    // Calculate resolution rate
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0

    // Calculate average resolution time
    let totalHours = 0
    let resolvedCount = 0
    complaints.forEach(c => {
      if (c.resolvedAt && c.createdAt) {
        const created = new Date(c.createdAt)
        const resolved = new Date(c.resolvedAt)
        const hours = (resolved - created) / (1000 * 60 * 60)
        totalHours += hours
        resolvedCount++
      }
    })
    const avgResolutionHours = resolvedCount > 0 ? Math.round(totalHours / resolvedCount) : 0

    return {
      success: true,
      data: {
        total,
        resolved,
        pending,
        inProgress,
        resolutionRate,
        avgResolutionHours
      }
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    throw error
  }
}
