import React, { useState } from 'react'
import { AlertCircle, MapPin } from 'lucide-react'
import ImageUpload from '../components/citizen/ImageUpload'
import LocationDetector from '../components/citizen/LocationDetetctor'
import SuccessModal from '../components/shared/SuccessModal'
import HowItWorks from '../components/citizen/HowItWorks'
import LiveStats from '../components/citizen/LiveStats'
import RecentResolutions from '../components/citizen/RecentResolutions'
import FeaturesShowcase from '../components/citizen/FeaturesShowcase'
import FAQ from '../components/citizen/FAQ'
import CTASection from '../components/citizen/CTASection'
import Card from '../components/shared/Card'
import Button from '../components/shared/Button'
import InputField from '../components/shared/InputField'
import SectionHeader from '../components/shared/SectionHeader'

function CitizenHome() {
  const [formData, setFormData] = useState({
    complaintType: '',
    description: '',
    latitude: null,
    longitude: null,
    image: null,
    imagePreview: null
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [generatedId, setGeneratedId] = useState('')
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const handleImageSelect = (file, preview) => {
    setFormData({
      ...formData,
      image: file,
      imagePreview: preview
    })
    if (errors.image) {
      setErrors({ ...errors, image: '' })
    }
  }

  const handleLocationDetect = (lat, lng) => {
    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng
    })
  }

  const generateComplaintId = () => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `CMP-${timestamp}${random}`
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.complaintType) {
      newErrors.complaintType = 'Please select a complaint type'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a description'
    }
    if (!formData.image) {
      newErrors.image = 'Please upload an image'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const complaintId = generateComplaintId()

    const complaint = {
      complaintId,
      complaintType: formData.complaintType,
      description: formData.description,
      latitude: formData.latitude,
      longitude: formData.longitude,
      imagePreview: formData.imagePreview,
      status: Math.random() > 0.5 ? 'Resolved' : 'Pending',
      createdAt: new Date().toISOString(),
      resolvedAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
    }

    const existingComplaints = JSON.parse(localStorage.getItem('complaints') || '[]')
    existingComplaints.push(complaint)
    localStorage.setItem('complaints', JSON.stringify(existingComplaints))

    setGeneratedId(complaintId)
    setShowSuccess(true)

    setFormData({
      complaintType: '',
      description: '',
      latitude: null,
      longitude: null,
      image: null,
      imagePreview: null
    })
  }

  return (
    <div className="min-h-screen bg-surface-50 px-3 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-[0_32px_120px_rgba(11,31,59,0.28)]">
        {/* Gradient hero with civic-first layout in deep navy theme */}
        <div className="bg-gradient-to-b from-primary-800 via-primary-700 to-primary-50">
          <div className="px-5 pt-8 pb-10 sm:px-8 lg:px-12 lg:pb-14">
            <div className="grid gap-10 lg:grid-cols-[1.6fr_minmax(0,1.4fr)] lg:items-stretch">
              {/* Left hero: city signal strip */}
              <div className="flex flex-col justify-between space-y-8 text-primary-50">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary-900/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint-300" />
                    <span>Resident Issue Board</span>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-primary-100/80">
                      One place for every pothole, blackout, and overflow across your city.
                    </p>
                    <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3rem]">
                      <span className="block">Your Town.</span>
                      <span className="block text-mint-200">Perfected in public.</span>
                    </h1>
                    <p className="max-w-lg text-sm sm:text-base text-primary-100/90">
                      Civic Pulse connects you straight to maintenance teams—no paperwork, no
                      switchboard, just clear reports and visible follow‑through.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
                    <a
                      href="#submit-form"
                      className="inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:px-5 sm:py-2.5"
                    >
                      Open a new ticket
                    </a>
                    <a
                      href="#how-it-works"
                      className="inline-flex items-center justify-center rounded-full border border-primary-200/70 bg-primary-900/10 px-4 py-2 text-xs font-semibold text-primary-50/90 backdrop-blur-sm transition hover:border-primary-100 sm:px-5 sm:py-2.5"
                    >
                      How the city uses this
                    </a>
                  </div>

                  {/* Unique civic strip row */}
                  <div className="grid gap-3 text-[11px] text-primary-100/90 sm:grid-cols-3">
                    <div className="rounded-2xl bg-primary-900/30 p-3">
                      <p className="font-semibold">Street & traffic</p>
                      <p className="mt-1 text-primary-100/85">
                        Potholes, lights, signage, crossings – anything that shapes your route.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-primary-900/25 p-3">
                      <p className="font-semibold">Clean & safe</p>
                      <p className="mt-1 text-primary-100/85">
                        Waste, flooding, vandalism, blocked drains, overflowing bins.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-primary-900/20 p-3">
                      <p className="font-semibold">Public spaces</p>
                      <p className="mt-1 text-primary-100/85">
                        Parks, sidewalks, community facilities, shared infrastructure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right hero: city lanes preview layered over real city image */}
              <div className="flex items-stretch">
                <div className="relative w-full overflow-hidden rounded-3xl">
                  <img
                    src="https://images.pexels.com/photos/313782/pexels-photo-313782.jpeg?auto=compress&cs=tinysrgb&w=1200"
                    alt="Aerial view of city streets and blocks"
                    className="absolute inset-0 h-full w-full object-cover opacity-80"
                  />
                  <div className="pointer-events-none absolute -left-6 -top-6 hidden h-20 w-36 rounded-2xl bg-white/40 blur-2xl sm:block" />
                  <Card className="relative m-3 h-full bg-white/95 p-4 shadow-xl sm:p-5 lg:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-primary-600">
                          City lanes
                        </p>
                        <p className="text-xs text-slate-500">
                          Sample view of how issues flow through departments.
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-mint-50 px-2 py-1 text-[10px] font-semibold text-primary-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-mint-300" />
                        Live queue
                      </span>
                    </div>

                    {/* Vertical lanes representing departments */}
                    <div className="grid h-full gap-3 sm:grid-cols-3">
                      <div className="flex flex-col rounded-2xl bg-slate-50 p-3">
                        <p className="text-[11px] font-semibold text-slate-600">Streets</p>
                        <div className="mt-2 flex-1 space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between rounded-lg bg-white px-2 py-1.5">
                            <span className="truncate pr-2">Pothole · Ward 3</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          </div>
                          <div className="flex items-center justify-between rounded-lg bg-white px-2 py-1.5">
                            <span className="truncate pr-2">Broken zebra crossing</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-mint-300" />
                          </div>
                          <div className="flex items-center justify-between rounded-lg bg-white px-2 py-1.5">
                            <span className="truncate pr-2">Sunken manhole</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col rounded-2xl bg-slate-50 p-3">
                        <p className="text-[11px] font-semibold text-slate-600">Utilities</p>
                        <div className="mt-2 flex-1 space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between rounded-lg bg-white px-2 py-1.5">
                            <span className="truncate pr-2">Water leak · Block C</span>
                            <span className="rounded-full bg-mint-50 px-2 py-0.5 text-[10px] font-semibold text-primary-700">
                              Routed
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded-lg bg-white px-2 py-1.5">
                            <span className="truncate pr-2">Streetlight outage</span>
                            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                              Queue
                            </span>
                          </div>
                          <div className="flex items-center justify-between rounded-lg bg-white px-2 py-1.5">
                            <span className="truncate pr-2">Loose cable</span>
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                              Logged
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col rounded-2xl bg-mint-50 p-3">
                        <p className="text-[11px] font-semibold text-primary-800">Public spaces</p>
                        <div className="mt-2 flex-1 space-y-1.5 text-[11px]">
                          <div className="rounded-lg bg-white px-2 py-1.5">
                            Riverside Park · litter build‑up
                          </div>
                          <div className="rounded-lg bg-white px-2 py-1.5">
                            Playground gate won’t close
                          </div>
                          <div className="rounded-lg bg-white px-2 py-1.5">
                            Tree blocking sidewalk
                          </div>
                        </div>
                        <div className="mt-3 rounded-xl bg-primary-700 px-2.5 py-1.5 text-[10px] font-semibold text-mint-50">
                          Your next report lands in one of these lanes.
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="bg-white px-5 pb-10 pt-8 sm:px-8 lg:px-12 lg:pb-12 lg:pt-10">
          {/* Sub-header aligned with hero */}
          <header className="mb-8 space-y-4">
            <SectionHeader
              eyebrow="New complaint"
              title="Report an Issue"
              subtitle="Log a civic issue in under two minutes so your city can triage, prioritize, and resolve it with full transparency."
              align="left"
            />
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-700/5 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-mint-300" />
                <span className="font-medium text-primary-700">Secure, city-grade platform</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                <AlertCircle className="h-3.5 w-3.5 text-slate-500" />
                <span>Track every report with a unique ID</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
                <MapPin className="h-3.5 w-3.5 text-primary-600" />
                <span>Smart location detection for precise routing</span>
              </div>
            </div>
          </header>

          {/* Main layout: form + side context */}
          <main className="grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)]">
            {/* Complaint form card */}
            <section id="submit-form">
              <Card className="p-5 sm:p-7 lg:p-8">
                <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 rounded-full bg-mint-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-mint-300" />
                      <span>New report</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-slate-900">
                      Complaint details
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Share a clear description, location, and a photo so the right team can take
                      action quickly.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600">
                    <span className="inline-flex h-1.5 w-1.5 rounded-full bg-mint-300" />
                    Average acknowledgement in under 24 hours
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-7">
                  {/* Complaint type */}
                  <div>
                    <InputField
                      as="select"
                      name="complaintType"
                      label="Complaint type"
                      required
                      badge="Required"
                      value={formData.complaintType}
                      onChange={handleInputChange}
                      error={errors.complaintType}
                      className="cursor-pointer appearance-none pr-10"
                    >
                      <option value="">Choose a category…</option>
                      <option value="pothole">🕳️ Pothole – Road damage</option>
                      <option value="streetlight">💡 Streetlight – Not working</option>
                      <option value="garbage">🗑️ Garbage – Collection issue</option>
                      <option value="water">💧 Water – Supply problem</option>
                      <option value="drainage">🌊 Drainage – Blockage</option>
                      <option value="road">🛣️ Road – Maintenance needed</option>
                      <option value="other">📋 Other – Describe below</option>
                    </InputField>
                    {/* Custom dropdown arrow */}
                    <div className="pointer-events-none -mt-8 flex justify-end pr-3 text-primary-500">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <InputField
                      as="textarea"
                      name="description"
                      label="Description"
                      required
                      badge="Required"
                      value={formData.description}
                      onChange={handleInputChange}
                      error={errors.description}
                      rows={5}
                      placeholder="Describe what’s happening, when you noticed it, and how it impacts your area."
                      className="resize-none"
                    />
                    <div className="mt-1 flex justify-end text-[11px] text-slate-400">
                      {formData.description.length} characters
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                        <MapPin className="h-3.5 w-3.5 text-primary-600" />
                        Location
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                        Optional – you can also describe it above
                      </span>
                    </div>
                    <LocationDetector
                      onLocationDetect={handleLocationDetect}
                      latitude={formData.latitude}
                      longitude={formData.longitude}
                    />
                  </div>

                  {/* Image upload */}
                  <div>
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      selectedImage={formData.imagePreview}
                    />
                    {errors.image && (
                      <p className="mt-2 text-[11px] font-medium text-red-600">{errors.image}</p>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      size="lg"
                      fullWidth
                      className="from-primary-700 via-primary-600 to-primary-700 bg-gradient-to-r hover:from-primary-800 hover:via-primary-700 hover:to-primary-800 shadow-[0_14px_40px_rgba(11,31,59,0.45)]"
                    >
                      Submit complaint
                    </Button>
                  </div>
                </form>
              </Card>
            </section>

            {/* Context column */}
            <aside className="space-y-4">
              <Card className="p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <AlertCircle className="h-4 w-4 text-primary-600" />
                  <span>What happens after you submit</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Every issue you log generates a unique tracking ID stored securely in your
                  browser. Use it anytime to monitor status, share with neighbours, or follow up
                  with your city team.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-mint-300" />
                    <span>Issues are batched and routed to the right department automatically.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-mint-300" />
                    <span>High-impact reports are prioritised based on severity and location.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-mint-300" />
                    <span>Historical reports help your city identify patterns and plan proactively.</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-5 sm:p-6">
                <div className="mb-3 flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <span>Live health</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-mint-100 px-2 py-0.5 text-[10px] font-semibold text-primary-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint-300" />
                    Operational
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                  <div>
                    <div className="text-xs text-slate-500">Average acknowledgement</div>
                    <div className="mt-1 text-base font-semibold text-slate-900">24 hours</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Resolution window</div>
                    <div className="mt-1 text-base font-semibold text-slate-900">48–72 hours</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Your reports stored as</div>
                    <div className="mt-1 text-base font-semibold text-slate-900">Local history</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Status visibility</div>
                    <div className="mt-1 text-base font-semibold text-slate-900">Real‑time</div>
                  </div>
                </div>
              </Card>
            </aside>
          </main>

          {/* Supporting sections */}
          <section id="how-it-works" className="space-y-12 pb-4 pt-10">
            <LiveStats />
            <HowItWorks />
            <RecentResolutions />
            <FeaturesShowcase />
            <FAQ />
            <CTASection />
          </section>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        complaintId={generatedId}
      />
    </div>
  )
}

export default CitizenHome