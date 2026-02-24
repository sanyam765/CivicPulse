import React from 'react'
import { Zap, Shield, Clock, Bell, MapPin, BarChart3 } from 'lucide-react'

function FeaturesShowcase() {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Submit complaints in under 2 minutes",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is encrypted and protected",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Tracking",
      description: "Monitor progress anytime, anywhere",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Real-time Updates",
      description: "Get notified on status changes",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Auto Location",
      description: "GPS-based issue pinpointing",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Track city-wide improvements",
      color: "from-indigo-500 to-purple-500"
    }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Powerful <span className="gradient-text">Features</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to report, track, and resolve civic issues efficiently
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative"
            >
              <div className="card p-8 h-full hover:shadow-glow transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                
                <div className={`relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} text-white rounded-xl shadow-lg mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  {feature.icon}
                </div>
                
                <h3 className="relative text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="relative text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesShowcase