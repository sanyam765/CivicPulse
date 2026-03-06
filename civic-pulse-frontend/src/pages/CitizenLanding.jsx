import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useRole } from "../context/RoleContext"
import { motion } from "framer-motion"
import Map, { Marker } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"

/* ─── Counter ─── */

function Counter({ target }) {

  const [count, setCount] = useState(0)

  useEffect(() => {

    let start = 0

    const interval = setInterval(() => {

      start += Math.ceil(target / 40)

      if (start >= target) {
        start = target
        clearInterval(interval)
      }

      setCount(start)

    }, 30)

  }, [target])

  return <span>{count}</span>

}

/* ─── Apple Reveal Animation ─── */

function Reveal({ children }) {

  return (

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >

      {children}

    </motion.div>

  )

}

/* ─── AI Detection Card ─── */

function AICard() {

  const [confidence, setConfidence] = useState(0)

  useEffect(() => {

    let val = 0

    const interval = setInterval(() => {

      val += 2

      setConfidence(val)

      if (val >= 98) clearInterval(interval)

    }, 40)

  }, [])

  return (

    <div className="bg-white rounded-3xl shadow-xl p-6 border">

      <div className="relative rounded-xl overflow-hidden">

        <img
          src="https://images.unsplash.com/photo-1515162816999-a0c47dc192f7"
          className="w-full h-48 object-cover"
        />

        <div className="absolute top-0 bottom-0 w-[3px] bg-emerald-400 animate-[scan_3s_linear_infinite]" />

      </div>

      <div className="mt-4">

        <div className="flex justify-between text-sm mb-2">
          <span>AI Detection</span>
          <span>{confidence}%</span>
        </div>

        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">

          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${confidence}%` }}
          />

        </div>

      </div>

    </div>

  )

}

/* ─── Map Component ─── */

function ComplaintMap() {

  const complaints = [
    { id: 1, lat: 19.076, lng: 72.8777 },
    { id: 2, lat: 19.079, lng: 72.879 },
    { id: 3, lat: 19.072, lng: 72.875 }
  ]

  return (

    <div className="rounded-3xl overflow-hidden shadow-xl">

      <Map
        initialViewState={{
          longitude: 72.8777,
          latitude: 19.076,
          zoom: 12,
          pitch: 50
        }}
        style={{ width: "100%", height: 400 }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken="YOUR_MAPBOX_TOKEN"
      >

        {complaints.map(c => (

          <Marker
            key={c.id}
            longitude={c.lng}
            latitude={c.lat}
          >

            <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping" />

          </Marker>

        ))}

      </Map>

    </div>

  )

}

/* ─── MAIN PAGE ─── */

export default function CitizenLanding() {

  const { switchToAdmin } = useRole()

  const [counts, setCounts] = useState({
    total: 0,
    resolved: 0,
    pending: 0
  })

  useEffect(() => {

    const stored = JSON.parse(localStorage.getItem("complaints") || "[]")

    setCounts({
      total: stored.length,
      resolved: stored.filter(c => c.status === "resolved").length,
      pending: stored.filter(c => c.status !== "resolved").length
    })

  }, [])

  return (

    <div className="min-h-screen bg-[#fdfdfd]">

      {/* HERO */}

      <section className="pt-32 pb-20 px-6">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          <Reveal>

            <div>

              <h1 className="text-6xl font-black text-slate-900 mb-6">
                A Smarter Way to Manage Civic Issues
              </h1>

              <p className="text-lg text-slate-500 mb-8">
                Bridge the gap between citizens and administration.
                Report issues and track solutions in real time.
              </p>

              <div className="flex gap-4">

                <Link
                  to="/citizen/submit"
                  className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold"
                >
                  Report Issue
                </Link>

                <Link
                  to="/citizen/track"
                  className="px-8 py-4 border rounded-xl font-bold"
                >
                  Track Complaint
                </Link>

              </div>

              {/* Stats */}

              <div className="mt-12 flex gap-8">

                <div>
                  <p className="text-3xl font-bold">
                    <Counter target={counts.total} />
                  </p>
                  <p className="text-xs uppercase text-slate-400">
                    Total Reports
                  </p>
                </div>

                <div>
                  <p className="text-3xl font-bold">
                    <Counter target={counts.resolved} />
                  </p>
                  <p className="text-xs uppercase text-slate-400">
                    Resolved
                  </p>
                </div>

                <div>
                  <p className="text-3xl font-bold">
                    <Counter target={counts.pending} />
                  </p>
                  <p className="text-xs uppercase text-slate-400">
                    Pending
                  </p>
                </div>

              </div>

            </div>

          </Reveal>

          <Reveal>
            <AICard />
          </Reveal>

        </div>

      </section>

      {/* CATEGORY GRID */}

      <section className="py-24 px-6">

        <div className="max-w-6xl mx-auto">

          <Reveal>

            <h2 className="text-4xl font-bold text-center mb-16">
              Report Any Civic Issue
            </h2>

          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">

            {["Pothole","Streetlight","Garbage","Water","Drainage","Road"].map((c,i)=>(

              <Reveal key={i}>

                <Link
                  to="/citizen/submit"
                  className="bg-white rounded-2xl p-8 shadow hover:shadow-xl transition"
                >

                  <h3 className="text-xl font-bold mb-2">{c}</h3>

                  <p className="text-slate-500 text-sm">
                    Report issues related to {c.toLowerCase()} infrastructure.
                  </p>

                </Link>

              </Reveal>

            ))}

          </div>

        </div>

      </section>

      {/* MAP */}

      <section className="py-24 px-6">

        <div className="max-w-6xl mx-auto">

          <Reveal>

            <h2 className="text-4xl font-bold text-center mb-12">
              Live City Issue Map
            </h2>

          </Reveal>

          <Reveal>
            <ComplaintMap />
          </Reveal>

        </div>

      </section>

      {/* CTA */}

      <section className="py-24 text-center bg-slate-900 text-white">

        <h2 className="text-5xl font-black mb-6">
          Help Improve Your City
        </h2>

        <Link
          to="/citizen/submit"
          className="px-10 py-5 bg-emerald-500 rounded-xl font-bold text-slate-900"
        >
          Start Reporting
        </Link>

      </section>

    </div>

  )

}