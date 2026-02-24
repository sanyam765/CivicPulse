import React from 'react'
import { ArrowRight, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'

function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-500 to-green-600 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Smartphone className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white">Available 24/7</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join thousands of citizens making our city better. Submit your first 
            complaint today and experience the power of civic engagement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <span>Submit Complaint Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            
            <Link
              to="/track"
              className="px-8 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl font-bold text-lg hover:bg-white/30 transform hover:scale-105 transition-all duration-300"
            >
              Track Existing Complaint
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8 text-white/80">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">1,234+</div>
              <div className="text-sm">Issues Resolved</div>
            </div>
            <div className="w-px h-12 bg-white/30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">98%</div>
              <div className="text-sm">Success Rate</div>
            </div>
            <div className="w-px h-12 bg-white/30"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">24h</div>
              <div className="text-sm">Avg Response</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTASection