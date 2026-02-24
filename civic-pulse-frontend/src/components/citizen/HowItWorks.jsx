import React from 'react'
import { FileText, Search, CheckCircle } from 'lucide-react'

function HowItWorks() {
  const steps = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Submit Complaint",
      description: "Report any civic issue with photo, location, and description in under 2 minutes.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Track Progress",
      description: "Get a unique ID to track your complaint status in real-time 24/7.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Get Resolved",
      description: "Municipal department reviews and resolves your issue within 48-72 hours.",
      color: "from-green-500 to-green-600"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple 3-step process to make your voice heard and get issues resolved
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative group"
            >
              {/* Connecting Line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary-300 to-transparent -z-10"></div>
              )}
              
              <div className="card p-8 text-center relative overflow-hidden">
                {/* Step Number */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-gray-100 group-hover:text-primary-100 transition-colors">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${step.color} text-white rounded-2xl shadow-lg mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {step.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks