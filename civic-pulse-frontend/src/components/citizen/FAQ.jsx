import React, { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "How long does it take to resolve a complaint?",
      answer: "Most complaints are resolved within 48-72 hours. High-priority issues like water leaks or safety hazards are addressed within 24 hours."
    },
    {
      question: "Do I need to create an account?",
      answer: "No! You can submit complaints anonymously. Just save your unique tracking ID to monitor progress."
    },
    {
      question: "Can I upload multiple images?",
      answer: "Currently, you can upload one image per complaint. Make sure it clearly shows the issue for faster resolution."
    },
    {
      question: "What types of complaints can I submit?",
      answer: "You can report potholes, streetlight issues, garbage collection problems, water supply issues, drainage problems, road damage, and more."
    },
    {
      question: "How do I track my complaint?",
      answer: "Use the 'Track' page and enter your unique complaint ID. You'll see real-time status updates and resolution details."
    },
    {
      question: "What if my complaint isn't resolved?",
      answer: "If there's no update within 5 days, you can resubmit or contact the municipal helpline. We track all complaints for accountability."
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <HelpCircle className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about Civic Pulse
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="card overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg font-semibold text-gray-800 pr-8">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-6 h-6 text-primary-600 flex-shrink-0 transform transition-transform duration-300 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-8 pb-6 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ