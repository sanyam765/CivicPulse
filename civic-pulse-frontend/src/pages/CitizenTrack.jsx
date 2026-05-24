



















import React, { useState, useEffect } from 'react'







import { Search, MapPin, Clock, Activity, Layers, Target } from 'lucide-react'








import { getComplaintById } from '../services/complaintService'
















const statusConfig = {

  'Pending': {
    label: 'Pending Review',
    bg: 'bg-amber-500/10',                           // /10 = 10% opacity
    text: 'text-amber-600',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]'  // amber glow
  },

  'In Progress': {
    label: 'In Progress',
    bg: 'bg-brand-500/10',                           // brand = custom teal color
    text: 'text-brand-600',
    border: 'border-brand-500/30',
    glow: 'shadow-[0_0_15px_rgba(20,184,166,0.3)]'
  },

  'Resolved': {
    label: 'Resolved',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-600',
    border: 'border-emerald-500/30',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]'
  },
}















const buildTimeline = (complaint) => {
  const timeline = []  // Start with empty array, push events into it



  if (complaint.status === 'Resolved' && complaint.resolvedAt) {
    timeline.push({
      status: 'Resolved',


      time: new Date(complaint.resolvedAt).toLocaleString(),

      desc: complaint.resolutionNotes || 'Issue has been resolved by the department.'
    })
  }

  if (complaint.status === 'In Progress') {
    timeline.push({
      status: 'In Progress',
      time: 'Currently active',




      desc: `Assigned to ${complaint.assignedTo?.name || 'department team'}. Work is in progress.`
    })
  }

  if (complaint.status === 'Pending') {
    timeline.push({
      status: 'Pending Review',
      time: 'Awaiting assignment',
      desc: 'Your complaint is in queue and will be assigned to the appropriate department.'
    })
  }


  timeline.push({
    status: 'Submitted',
    time: new Date(complaint.createdAt).toLocaleString(),
    desc: 'Complaint registered and logged in the civic system.'
  })

  return timeline  // Example: [ {Resolved,...}, {Submitted,...} ]
}











const getImageUrl = (imagePath) => {
  if (!imagePath) return null  // No image → return null, hide the img element

  if (imagePath.startsWith('http')) return imagePath



  return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`
}



export default function CitizenTrack() {


  const [query, setQuery] = useState('')



  const [result, setResult] = useState(null)



  const [searching, setSearching] = useState(false)



  const [notFound, setNotFound] = useState(false)



  const [error, setError] = useState('')

















  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash.startsWith('CMP-')) {
      setQuery(hash)        // Fill the input box visually
      performSearch(hash)   // Trigger search automatically
    }
  }, [])











  const performSearch = async (id) => {




    const searchId = (id || query).trim().toUpperCase()

    if (!searchId) return


    setSearching(true)    // Show spinner in the button
    setNotFound(false)    // Hide "not found" card
    setResult(null)       // Hide previous result card
    setError('')          // Hide previous error card

    try {













      const response = await getComplaintById(searchId)




      const complaint = response.data.complaint

      const imageUrl = getImageUrl(complaint.image)



      setResult({
        id: complaint.complaintId,   // "CMP-ABC123"
        title: complaint.description, // Use description as title (no separate title field)
        type: complaint.complaintType, // "pothole" | "garbage" | "water" etc.
        status: complaint.status,      // "Pending" | "In Progress" | "Resolved"
        priority: complaint.priority,  // "Low" | "Medium" | "High"




        location: complaint.location
          ? `${complaint.location.latitude?.toFixed(4)}° N, ${complaint.location.longitude?.toFixed(4)}° E — ${complaint.location.address || ''}`
          : 'Location not provided',



        assignee: complaint.assignedTo?.name || 'Pending Department Assignment',

        date: complaint.createdAt,           // ISO timestamp
        image: imageUrl,                     // Full URL or null
        timeline: buildTimeline(complaint)   // Array from our helper function
      })

    } catch (err) {









      if (err.message === 'Complaint not found') {
        setNotFound(true) // Show "No Report Found" card
      } else {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {



      setSearching(false)
    }
  }


  const handleSearch = () => performSearch(query)


  const getStatusInfo = (s) => statusConfig[s] || statusConfig['Pending']



  return (



    <div className="min-h-screen bg-gradient-mesh text-slate-800 pt-24 pb-20 relative overflow-hidden">

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-400/20 rounded-full blur-[120px] mix-blend-multiply animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] mix-blend-multiply animate-float" style={{ animationDelay: '-4s' }} />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">

        <div className="text-center mb-12 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-slate-200/50 text-xs font-bold text-slate-500 mb-6 backdrop-blur-md">
            <Activity className="w-4 h-4 text-brand-500" /> Live Tracking System
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 mb-4 tracking-tight">
            Track Your <span className="text-gradient">Report</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-lg mx-auto">
            Enter your Civic Ticket ID to get real-time status from the database.
          </p>
        </div>

        <div className="glass-strong rounded-3xl p-3 sm:p-4 shadow-floating mb-12 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">

            <div className="relative flex-1 group">

              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-brand-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={query}     // Controlled input: value tied to React state
                onChange={(e) => setQuery(e.target.value)}   // Update state on each keystroke
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}  // Enter key triggers search
                placeholder="Enter Civic ID (e.g. CMP-ABC123)"

                className="w-full pl-14 pr-5 py-4 bg-white/80 border-2 border-slate-200/60 rounded-2xl text-base font-mono font-bold text-slate-700 placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:outline-none transition-all shadow-inner"
              />
            </div>

            <button
              onClick={handleSearch}


              disabled={searching || !query.trim()}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-base transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 min-w-[140px] group overflow-hidden relative shadow-[0_10px_30px_-10px_rgba(15,23,34,0.5)]"
            >

              <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-cyan-500 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-500 ease-out z-0" />

              <div className="relative z-10 flex items-center gap-2">

                {searching
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : 'Track Issue'
                }
              </div>
            </button>
          </div>
        </div>

        <div className="min-h-[400px]">

          {error && (
            <div className="glass-card rounded-3xl p-10 text-center animate-scale-in border border-red-100 max-w-2xl mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-50 text-red-400 rounded-full flex items-center justify-center">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-800 mb-2">Connection Error</h3>

              <p className="text-slate-500 font-medium">{error}</p>
              <p className="text-xs text-slate-400 mt-2">Make sure your backend server is running on port 5000</p>
            </div>
          )}

          {notFound && !error && (
            <div className="glass-card rounded-3xl p-16 text-center animate-scale-in border border-white max-w-2xl mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10" />
              </div>
              <h3 className="font-display text-2xl font-bold text-slate-800 mb-2">No Report Found</h3>
              <p className="text-slate-500 font-medium">
                We couldn't find{' '}

                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{query}</span>.
                <br />Please check the ID and try again.
              </p>
            </div>
          )}

          {!result && !notFound && !searching && !error && (
            <div className="glass-card rounded-3xl p-16 text-center border border-white/50 max-w-2xl mx-auto opacity-70">
              <div className="w-20 h-20 mx-auto mb-6 bg-slate-100/50 text-slate-400 rounded-full flex items-center justify-center">
                <Activity className="w-8 h-8 opacity-50" />
              </div>
              <p className="text-slate-500 font-medium font-mono">WAITING_FOR_INPUT</p>
              <p className="text-xs text-slate-400 mt-2">Enter your Complaint ID to see real-time status</p>
            </div>
          )}

          {result && !searching && (

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-slide-up">

              <div className="lg:col-span-5 space-y-6">
                <div className="relative bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-glass overflow-hidden">

                  <div className="p-8 border-b border-slate-200/60 relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-400/10 rounded-bl-[100px] pointer-events-none" />

                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex justify-between">
                      <span>Official Ticket</span>

                      <span className="font-mono text-brand-600 bg-brand-50 px-2 py-0.5 rounded">{result.id}</span>
                    </div>

                    <h2 className="font-display text-xl font-bold text-slate-800 mb-4 leading-tight pr-4">
                      {result.title}
                    </h2>

                    <div className={`px-4 py-2 rounded-xl border ${getStatusInfo(result.status).border} ${getStatusInfo(result.status).bg} ${getStatusInfo(result.status).text} ${getStatusInfo(result.status).glow} flex items-center gap-2 w-fit`}>

                      {result.status === 'In Progress' && <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />}

                      {result.status === 'Resolved' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {getStatusInfo(result.status).label}
                      </span>
                    </div>
                  </div>

                  <div className="relative flex justify-between px-2 -mt-2 z-10 pointer-events-none">
                    {[...Array(15)].map((_, i) => (

                      <div key={i} className="w-3 h-3 bg-slate-50/50 rounded-full shadow-inner" />
                    ))}
                  </div>

                  <div className="p-8 bg-slate-50/50 space-y-5">

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-500 flex-shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category & Priority</p>

                        <p className="text-sm font-bold text-slate-700 capitalize">
                          {result.type} • {result.priority} priority
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-cyan-500 flex-shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logged Location</p>

                        <p className="text-sm font-bold text-slate-700 pr-4">{result.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-purple-500 flex-shrink-0">
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Responsibility</p>
                        <p className="text-sm font-bold text-slate-700">{result.assignee}</p>
                      </div>
                    </div>

                    {result.image && (
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                          Submitted Photo
                        </p>
                        <img
                          src={result.image}    // Full URL to the image on backend server
                          alt="Complaint photo"

                          className="w-full h-40 object-cover rounded-xl border border-slate-200 shadow-sm"
                          onError={(e) => {


                            e.target.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/60 shadow-glass h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-bl-[200px] pointer-events-none" />

                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200/60 relative z-10">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-slate-800">Resolution Journey</h3>
                      <p className="text-sm text-slate-500 font-medium mt-1">Live status from the database.</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-100 to-cyan-100 text-brand-600 flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="relative z-10 pl-4 sm:pl-8">

                    <div className="absolute left-6 sm:left-10 top-4 bottom-4 w-0.5 bg-gradient-to-b from-brand-400 via-brand-200 to-slate-200 z-0" />

                    <div className="space-y-10">

                      {result.timeline.map((event, i) => {


                        const isLatest = i === 0

                        return (

                          <div key={i} className="relative z-10 flex gap-6 sm:gap-8 group">

                            <div className={`relative flex-shrink-0 w-5 h-5 rounded-full mt-1 flex items-center justify-center transition-all duration-300
                              ${isLatest
                                ? 'bg-brand-500 shadow-[0_0_0_4px_rgba(20,184,166,0.2)] ring-2 ring-white scale-125'
                                : 'bg-white border-2 border-slate-300 group-hover:border-brand-300 group-hover:scale-110'
                              }`}
                            >

                              {isLatest && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                            </div>

                            <div className={`flex-1 rounded-2xl p-5 border transition-all duration-300 backdrop-blur-sm
                              ${isLatest
                                ? 'bg-white/80 shadow-md border-brand-100 -mt-3'
                                : 'bg-white/40 border-slate-100 hover:bg-white/60 hover:-translate-y-1'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">

                                <span className={`text-base font-bold ${isLatest ? 'text-brand-700' : 'text-slate-700'}`}>
                                  {event.status}
                                </span>

                                <span className="text-xs font-bold text-slate-400 font-mono tracking-tight bg-slate-100/50 px-2 py-1 rounded w-fit">
                                  {event.time}
                                </span>
                              </div>

                              <p className={`text-sm ${isLatest ? 'text-slate-600 font-medium' : 'text-slate-500'}`}>
                                {event.desc}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  )
}