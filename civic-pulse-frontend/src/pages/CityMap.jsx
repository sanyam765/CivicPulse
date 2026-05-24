import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { getAllComplaints } from '../services/complaintService'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

// Custom marker icons by status
const getMarkerIcon = (status) => {
  const colors = {
    'Pending': '#f59e0b',      // Amber
    'In Progress': '#3b82f6',  // Blue
    'Resolved': '#10b981'      // Green
  }
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 30px;
      height: 30px;
      background: ${colors[status] || '#gray'};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  })
}

// Component to auto-fit map bounds
function MapBounds({ complaints }) {
  const map = useMap()
  
  useEffect(() => {
    if (complaints.length > 0) {
      const bounds = complaints
        .filter(c => c.location)
        .map(c => [c.location.latitude, c.location.longitude])
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }
  }, [complaints, map])
  
  return null
}

const getResolutionHours = (complaint) => {
  if (!complaint?.createdAt || !complaint?.resolvedAt) return null

  const created = new Date(complaint.createdAt)
  const resolved = new Date(complaint.resolvedAt)
  const diffMs = resolved - created

  return Number.isFinite(diffMs) && diffMs >= 0 ? diffMs / (1000 * 60 * 60) : null
}

const buildMapStats = (complaints) => {
  const pending = complaints.filter(c => c.status === 'Pending').length
  const inProgress = complaints.filter(c => c.status === 'In Progress').length
  const resolved = complaints.filter(c => c.status === 'Resolved').length

  // Hotspots are computed from complaint density in a coarse grid so the overlay stays live.
  const clusterCounts = complaints.reduce((clusters, complaint) => {
    const latitude = complaint?.location?.latitude
    const longitude = complaint?.location?.longitude

    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return clusters
    }

    const bucket = `${latitude.toFixed(2)},${longitude.toFixed(2)}`
    clusters[bucket] = (clusters[bucket] || 0) + 1
    return clusters
  }, {})

  const hotspots = Object.values(clusterCounts).filter(count => count >= 2).length

  const resolvedHours = complaints
    .map(getResolutionHours)
    .filter(hours => hours !== null)

  const avgResponse = resolvedHours.length > 0
    ? `${Math.round(resolvedHours.reduce((sum, hours) => sum + hours, 0) / resolvedHours.length)}h`
    : '0h'

  return {
    total: complaints.length,
    pending,
    inProgress,
    resolved,
    hotspots,
    activeCrews: inProgress,
    avgResponse
  }
}

function CityMap() {
  const [complaints, setComplaints] = useState([])
  const [filteredComplaints, setFilteredComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    hotspots: 0,
    activeCrews: 0,
    avgResponse: '0h'
  })

  useEffect(() => {
    fetchComplaints()
    const interval = setInterval(fetchComplaints, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredComplaints(complaints)
    } else {
      setFilteredComplaints(complaints.filter(c => c.status === filterStatus))
    }
  }, [complaints, filterStatus])

  const fetchComplaints = async () => {
    try {
      const response = await getAllComplaints()
      const data = response.data.complaints.filter(c => c.location) // Only with location
      
      setComplaints(data)
      setFilteredComplaints(data)
      
      // Build the map overlay directly from the live complaint feed.
      setStats(buildMapStats(data))
      
    } catch (error) {
      console.error('Failed to fetch complaints:', error)
    } finally {
      setLoading(false)
    }
  }

  // Default center keeps the map anchored until the live complaint bounds are available.
  const defaultCenter = [28.6139, 77.2090] // Delhi

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar - Keep your existing sidebar */}
      <div className="w-64 bg-white border-r">
        {/* Your existing admin sidebar */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-white border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900">City Map</h1>
              <p className="text-sm text-gray-500">Real-time complaint locations</p>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-xl font-bold text-sm ${
                  filterStatus === 'all' 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                All ({complaints.length})
              </button>
              <button
                onClick={() => setFilterStatus('Pending')}
                className={`px-4 py-2 rounded-xl font-bold text-sm ${
                  filterStatus === 'Pending' 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Pending ({stats.pending})
              </button>
              <button
                onClick={() => setFilterStatus('In Progress')}
                className={`px-4 py-2 rounded-xl font-bold text-sm ${
                  filterStatus === 'In Progress' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                In Progress ({stats.inProgress})
              </button>
              <button
                onClick={() => setFilterStatus('Resolved')}
                className={`px-4 py-2 rounded-xl font-bold text-sm ${
                  filterStatus === 'Resolved' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Resolved ({stats.resolved})
              </button>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          
          {/* Stats Overlay */}
          <div className="absolute top-4 right-4 z-[1000] bg-white rounded-2xl shadow-xl p-6 w-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-gray-900">Overview</h3>
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">● LIVE</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Reports</span>
                <span className="text-lg font-black text-gray-900">{stats.total}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Hotspot Zones</span>
                <span className="text-lg font-black text-red-600">{stats.hotspots}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Crews</span>
                <span className="text-lg font-black text-blue-600">{stats.activeCrews}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Response</span>
                <span className="text-lg font-black text-emerald-600">{stats.avgResponse}</span>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t">
              <p className="text-xs font-bold text-gray-500 mb-3">Legend</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Resolved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Leaflet Map */}
          {!loading && (
            <MapContainer
              center={defaultCenter}
              zoom={12}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Auto-fit bounds */}
              <MapBounds complaints={filteredComplaints} />

              {/* Complaint Markers */}
              {filteredComplaints.map((complaint) => (
                <Marker
                  key={complaint._id}
                  position={[complaint.location.latitude, complaint.location.longitude]}
                  icon={getMarkerIcon(complaint.status)}
                >
                  <Popup className="custom-popup">
                    <div className="p-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          complaint.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          complaint.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {complaint.status}
                        </span>
                      </div>
                      
                      <h4 className="font-bold text-gray-900 mb-1 capitalize">
                        {complaint.complaintType}
                      </h4>
                      
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {complaint.description}
                      </p>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>ID: {complaint.complaintId}</p>
                        <p>📅 {new Date(complaint.createdAt).toLocaleDateString()}</p>
                        <p>📍 {complaint.location.latitude.toFixed(4)}, {complaint.location.longitude.toFixed(4)}</p>
                      </div>

                      {complaint.image && (
                        <img
                          src={`http://localhost:5000/${complaint.image.replace(/\\/g, '/')}`}
                          alt="Complaint"
                          className="w-full h-24 object-cover rounded mt-2"
                        />
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}

          {/* Loading State */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Loading map...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CityMap