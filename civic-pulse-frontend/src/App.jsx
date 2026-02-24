import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { RoleProvider, useRole } from './context/RoleContext'
import Sidebar from './components/shared/Sidebar'
import ParticleBackground from './components/shared/ParticleBackground'

// Auth
import Auth from './pages/Auth'

// Admin Pages
import Dashboard from './pages/Dashboard'
import Complaints from './pages/Complaints'
import MapView from './pages/MapView'
import Timeline from './pages/Timeline'
import Analytics from './pages/Analytics'
import SubmitComplaint from './pages/SubmitComplaint'
import Settings from './pages/Settings'

// Citizen Pages
import CitizenLanding from './pages/CitizenLanding'
import CitizenSubmit from './pages/CitizenSubmit'
import CitizenTrack from './pages/CitizenTrack'
import CitizenMyComplaints from './pages/CitizenMyComplaints'
import CitizenNavbar from './components/citizen/CitizenNavbar'

/* ─── Helpers ─── */
function ProtectedRoute({ children, requiredRole }) {
  const { isLoggedIn, role } = useRole()

  if (!isLoggedIn) return <Navigate to="/login" replace />
  if (requiredRole && role !== requiredRole) {
    return <Navigate to={role === 'admin' ? '/' : '/citizen'} replace />
  }
  return children
}

function PublicRoute({ children }) {
  const { isLoggedIn, role } = useRole()
  if (isLoggedIn) {
    return <Navigate to={role === 'admin' ? '/' : '/citizen'} replace />
  }
  return children
}

/* ─── Admin Layout ─── */
function AdminLayout() {
  const [collapsed, setCollapsed] = React.useState(false)

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className={`transition-all duration-500 min-h-screen relative z-10 ${collapsed ? 'ml-[78px]' : 'ml-[260px]'}`}>
        <div className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/submit" element={<SubmitComplaint />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

/* ─── Citizen Layout ─── */
function CitizenLayout() {
  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <CitizenNavbar />
      <Routes>
        <Route path="/" element={<CitizenLanding />} />
        <Route path="/submit" element={<CitizenSubmit />} />
        <Route path="/track" element={<CitizenTrack />} />
        <Route path="/my-complaints" element={<CitizenMyComplaints />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

/* ─── Role Router ─── */
function RoleRouter() {
  const { role, isLoggedIn } = useRole()

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Auth /></PublicRoute>} />

      {isLoggedIn ? (
        <>
          {role === 'admin' ? (
            <>
              <Route path="/*" element={<AdminLayout />} />
              <Route path="/citizen/*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/citizen/*" element={<CitizenLayout />} />
              <Route path="/*" element={<Navigate to="/citizen" replace />} />
            </>
          )}
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <RoleProvider>
        <RoleRouter />
      </RoleProvider>
    </Router>
  )
}

export default App