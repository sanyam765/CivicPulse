





























import React, { useState, useEffect } from 'react'



import { Link } from 'react-router-dom'











import { Clock, MapPin, AlertCircle, ChevronRight, Filter, Loader2 } from 'lucide-react'



import { getMyComplaints } from '../services/complaintService'



















const getImageUrl = (imagePath) => {

  if (!imagePath) return null                     // No image → return null

  if (imagePath.startsWith('http')) return imagePath  // Already full URL → use as-is

  return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`     // Build full URL from relative path

}





const statusConf = {

  'Pending': {

    label: 'Pending Review',

    bg: 'bg-amber-500/10',

    text: 'text-amber-600',

    border: 'border-amber-500/30',

    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]'

  },

  'In Progress': {

    label: 'In Progress',

    bg: 'bg-brand-500/10',

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

const categoryIcons = {

  pothole: '🕳️',

  streetlight: '💡',

  garbage: '🗑️',

  water: '💧',

  drainage: '🌊',

  road: '🛣️'

}



export default function CitizenMyComplaints() {

  const [complaints, setComplaints] = useState([])





  const [filter, setFilter] = useState('all')





  const [loading, setLoading] = useState(true)



  const [error, setError] = useState('')





















  useEffect(() => {





    const fetchComplaints = async () => {

      try {































        const response = await getMyComplaints()

        setComplaints(response.data.complaints)



      } catch (err) {

        setError(err.message || 'Failed to load complaints. Please try again.')

      } finally {

        setLoading(false)

      }

    }

    fetchComplaints()

  }, [])  // [] = only run once































  const filtered = filter === 'all'

    ? complaints

    : complaints.filter((c) => c.status === filter)



  return (

    <div className="min-h-screen bg-gradient-mesh text-slate-800 pt-24 pb-20 relative overflow-hidden">



      <div className="fixed inset-0 pointer-events-none z-0">

        <div className="absolute top-[20%] right-[10%] w-96 h-96 bg-brand-400/20 rounded-full blur-[100px] mix-blend-multiply animate-float" />

        <div className="absolute bottom-[10%] left-[5%] w-[30rem] h-[30rem] bg-cyan-400/10 rounded-full blur-[120px] mix-blend-multiply animate-float-slow" />

      </div>



      <div className="max-w-5xl mx-auto px-6 relative z-10">



        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">



          <div className="animate-slide-up">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 border border-slate-200/50 text-xs font-bold text-slate-500 mb-4 backdrop-blur-md">

              <AlertCircle className="w-4 h-4 text-brand-500" /> My Report History

            </div>

            <h1 className="text-4xl sm:text-5xl font-display font-extrabold tracking-tight text-slate-900 mb-2">

              Citizen <span className="text-gradient">Ticketing</span>

            </h1>

            <p className="text-slate-500 text-sm font-medium">

              Track your reports and watch your city improve in real-time.

            </p>

          </div>



          <div className="flex bg-white/60 p-1 rounded-2xl border border-white backdrop-blur-md shadow-glass-hover animate-slide-up">



            {['all', 'Pending', 'In Progress', 'Resolved'].map((f) => {

              const isActive = filter === f

              return (

                <button

                  key={f}

                  onClick={() => setFilter(f)}  // Update filter state on click

                  className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 z-10 ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-800'}`}

                >



                  {isActive && (

                    <div className="absolute inset-0 bg-slate-800 rounded-xl shadow-lg -z-10 animate-scale-in" />

                  )}

                  <span className="relative z-10 flex items-center gap-2 capitalize">



                    {f === 'all' && <Filter className="w-3.5 h-3.5" />}



                    {f}

                  </span>

                </button>

              )

            })}

          </div>

        </div>



        {loading && (

          <div className="flex flex-col items-center justify-center py-24 gap-4">



            <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />

            <p className="text-slate-500 font-medium">Fetching your complaints from database...</p>

          </div>

        )}



        {error && !loading && (

          <div className="glass-card rounded-3xl p-16 text-center border border-red-100 max-w-2xl mx-auto">

            <div className="w-20 h-20 mx-auto mb-6 bg-red-50 text-red-400 rounded-full flex items-center justify-center">

              <AlertCircle className="w-10 h-10" />

            </div>

            <h3 className="font-display text-2xl font-bold text-slate-800 mb-2">Failed to Load</h3>



            <p className="text-slate-500 font-medium">{error}</p>

            <p className="text-xs text-slate-400 mt-2">Make sure your backend is running on port 5000</p>



            <button

              onClick={() => window.location.reload()}

              className="mt-6 px-6 py-2.5 bg-brand-500 text-white text-sm font-bold rounded-xl hover:bg-brand-600 transition-colors"

            >

              Try Again

            </button>

          </div>

        )}



        {!loading && !error && (

          <div className="space-y-6">



            {filtered.length === 0 ? (

              <div className="glass-strong rounded-3xl p-16 text-center animate-scale-in shadow-floating border border-white">

                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full flex items-center justify-center shadow-inner border border-slate-200/50">

                  <span className="text-4xl opacity-50">📭</span>

                </div>

                <h3 className="font-display text-xl font-bold text-slate-800 mb-2">No Reports Found</h3>

                <p className="text-slate-500">



                  {filter === 'all'

                    ? "No complaints have been submitted yet."

                    : `You have no "${filter}" complaints.`}

                </p>



                {filter !== 'all' && (

                  <button

                    onClick={() => setFilter('all')}  // Reset filter to show all

                    className="mt-6 px-6 py-2.5 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition-colors"

                  >

                    Clear Filters

                  </button>

                )}

              </div>

            ) : (







              filtered.map((c, i) => {

                const conf = statusConf[c.status] || statusConf['Pending']



                const date = new Date(c.createdAt)

                const imageUrl = getImageUrl(c.image)



                return (

                  <Link

                    to={`/citizen/track#${c.complaintId}`}

                    key={c.complaintId}   // React requires unique key for list items

                    className="block group levitate"  // levitate = custom animation class

                    style={{ animationDelay: `${i * 150}ms` }}  // Stagger each card's entrance

                  >



                    <div className="relative flex flex-col sm:flex-row bg-white/70 backdrop-blur-2xl rounded-3xl border border-white/60 shadow-glass-hover hover:shadow-floating transition-all duration-500 overflow-hidden">



                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${conf.bg.replace('/10', '')} opacity-70 group-hover:opacity-100 transition-opacity`} />



                      <div className="sm:w-48 bg-slate-50/50 p-6 flex sm:flex-col items-center sm:items-start justify-between sm:justify-center border-b sm:border-b-0 sm:border-r border-slate-200/50 relative overflow-hidden">

                        <div className="absolute right-0 top-0 w-16 h-16 bg-gradient-to-br from-brand-100 to-transparent rounded-bl-full opacity-50 pointer-events-none" />



                        <div>

                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Filed On</div>



                          <div className="font-display text-2xl font-extrabold text-slate-800 leading-none">

                            {date.getDate()}

                          </div>



                          <div className="text-sm font-bold text-brand-600 mb-4">

                            {date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}

                          </div>

                        </div>



                        <div className="text-right sm:text-left">

                          <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ticket ID</div>

                          <div className="font-mono text-xs font-bold bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 shadow-sm">

                            {c.complaintId}

                          </div>

                        </div>



                        <div className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex-col gap-2">

                          {[1, 2, 3, 4, 5, 6, 7].map(dot => (

                            <div key={dot} className="w-1.5 h-1.5 rounded-full bg-white shadow-inner" />

                          ))}

                        </div>

                      </div>



                      <div className="flex-1 p-6 relative">

                        <div className="flex flex-col h-full justify-between">

                          <div>



                            <div className="flex items-start justify-between mb-2">

                              <h3 className="text-lg sm:text-xl font-bold text-slate-800 group-hover:text-brand-700 transition-colors">



                                {c.description}

                              </h3>

                              <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-xl flex-shrink-0 ml-4 group-hover:rotate-12 transition-transform">



                                {categoryIcons[c.complaintType] || '📌'}

                              </div>

                            </div>



                            <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-6">



                              {c.location && (

                                <div className="flex items-center gap-1.5">

                                  <MapPin className="w-3.5 h-3.5 text-slate-400" />



                                  <span className="truncate max-w-[200px]">{c.location.address || 'Location provided'}</span>

                                </div>

                              )}

                              <div className="flex items-center gap-1.5">

                                <Clock className="w-3.5 h-3.5 text-slate-400" />



                                <span>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                              </div>

                            </div>



                            {imageUrl && (

                              <div className="mb-4">

                                <img

                                  src={imageUrl}      // Full URL to backend image

                                  alt="Complaint photo"

                                  className="w-full h-32 object-cover rounded-xl border border-slate-200 shadow-sm"

                                  onError={(e) => {

                                    e.target.style.display = 'none'

                                  }}

                                />

                              </div>

                            )}

                          </div>



                          <div className="flex items-center justify-between">



                            <div className={`px-3 py-1.5 rounded-lg border ${conf.border} ${conf.bg} ${conf.text} ${conf.glow} flex items-center gap-2 w-fit`}>



                              {c.status === 'In Progress' && <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />}



                              {c.status === 'Resolved' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}

                              <span className="text-[11px] font-bold uppercase tracking-wider">{conf.label}</span>

                            </div>



                            <div className="flex items-center gap-2 text-xs font-bold text-brand-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">

                              View Updates

                              <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center">

                                <ChevronRight className="w-4 h-4" />

                              </div>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                  </Link>

                )

              })

            )}

          </div>

        )}

      </div>

    </div>

  )

}