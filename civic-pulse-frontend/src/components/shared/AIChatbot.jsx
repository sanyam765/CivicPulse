import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Send, Minimize2, Sparkles, Zap } from 'lucide-react'
import { getAIResponse } from '../../services/aiservice'
import { getComplaintById } from '../../services/complaintService'
import { getSystemStats } from '../../services/statsService'

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI-powered Civic Pulse Assistant 🤖\n\nI can help you with:\n• Check complaint status\n• Submit new complaints\n• Answer questions about the system\n• Provide real-time statistics\n\nWhat would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
      isAI: true
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationHistory, setConversationHistory] = useState([])
  const messagesEndRef = useRef(null)

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Enhanced bot response with AI + Tools
  const getBotResponse = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase().trim()
    
    // 1. Check if user provided complaint ID (direct tool call)
    if (lowerMessage.match(/^cmp-\d+$/)) {
      try {
        const response = await getComplaintById(lowerMessage.toUpperCase())
        const complaint = response.data.complaint
        
        return {
          text: `📋 **Complaint Found!**\n\n` +
                `**ID:** ${complaint.complaintId}\n` +
                `**Type:** ${complaint.complaintType.toUpperCase()}\n` +
                `**Status:** ${complaint.status}\n` +
                `**Priority:** ${complaint.priority}\n` +
                `**Submitted:** ${new Date(complaint.createdAt).toLocaleDateString()}\n\n` +
                `${complaint.status === 'Resolved' 
                  ? `✅ **Resolved on:** ${new Date(complaint.resolvedAt).toLocaleDateString()}` 
                  : '⏳ Your complaint is being processed'}`,
          needsAI: false
        }
      } catch (error) {
        return {
          text: "❌ Complaint not found. Please check the ID format.\n\nExample: CMP-1234567890123",
          needsAI: false
        }
      }
    }
    
    // 2. Check if user wants statistics (direct tool call)
    if (lowerMessage.match(/(show|get|fetch|what).*(stat|number|count|data)/)) {
      try {
        const stats = await getSystemStats()
        const data = stats.data
        
        return {
          text: `📊 **LIVE STATISTICS**\n\n` +
                `**Total Complaints:** ${data.total}\n` +
                `**✅ Resolved:** ${data.resolved}\n` +
                `**⏳ Pending:** ${data.pending}\n` +
                `**🔄 In Progress:** ${data.inProgress}\n\n` +
                `**Resolution Rate:** ${data.resolutionRate}%\n` +
                `**Avg Resolution:** ${data.avgResolutionHours} hours\n\n` +
                `_Updated: ${new Date().toLocaleTimeString()}_`,
          needsAI: false
        }
      } catch (error) {
        return {
          text: "Unable to fetch statistics. Please try again.",
          needsAI: false
        }
      }
    }
    
    // 3. For everything else, use AI
    return {
      text: null,
      needsAI: true
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    const currentInput = inputText
    setInputText('')
    setIsTyping(true)
    
    try {
      // First check if we can handle with tools
      const toolResponse = await getBotResponse(currentInput)
      
      let botResponseText
      let isAI = false
      
      if (toolResponse.needsAI) {
        // Use AI for natural language queries
        const aiResponse = await getAIResponse(currentInput, conversationHistory)
        
        if (aiResponse.success) {
          botResponseText = aiResponse.message
          isAI = true
          
          // Update conversation history
          setConversationHistory(prev => [
            ...prev,
            { role: 'user', content: currentInput },
            { role: 'assistant', content: aiResponse.message }
          ])
        } else {
          botResponseText = aiResponse.message // Fallback message
        }
      } else {
        // Use tool response
        botResponseText = toolResponse.text
      }
      
      // Add bot response
      const botMessage = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
        isAI: isAI
      }
      
      setMessages(prev => [...prev, botMessage])
      
    } catch (error) {
      console.error('Chat error:', error)
      
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm having trouble processing your request. Please try again or use the quick action buttons below.",
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Enhanced quick actions
  const quickActions = [
    { 
      text: "📋 Track Complaint", 
      action: "How do I track my complaint?",
      icon: "📋"
    },
    { 
      text: "📊 Show Stats", 
      action: "show statistics",
      icon: "📊"
    },
    { 
      text: "📝 Submit Issue", 
      action: "I want to submit a complaint",
      icon: "📝"
    },
    { 
      text: "❓ Help", 
      action: "What can you help me with?",
      icon: "❓"
    },
  ]

  const handleQuickAction = (action) => {
    setInputText(action)
  }

  // Sample questions
  const sampleQuestions = [
    "How do I submit a complaint?",
    "What types of issues can I report?",
    "How long does it take to resolve complaints?",
    "Can I submit anonymously?",
  ]

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-full shadow-2xl hover:shadow-emerald-500/50 hover:scale-110 transition-all z-50 flex items-center justify-center group"
      >
        <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500"></span>
        </span>
      </button>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 w-[420px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col transition-all overflow-hidden ${
      isMinimized ? 'h-16' : 'h-[650px]'
    }`}>
      
      {/* Header with AI Badge */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">Civic Assistant</h3>
              <span className="bg-yellow-300 text-emerald-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" />
                AI
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-100">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <span>Always here to help</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-emerald-50/30 to-white">
            {messages.length === 1 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2 font-medium">Try asking:</p>
                <div className="grid grid-cols-1 gap-2">
                  {sampleQuestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => setInputText(q)}
                      className="text-left text-xs p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition-colors"
                    >
                      💬 {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-md border border-emerald-100'
                  }`}
                >
                  {message.isAI && (
                    <div className="flex items-center gap-1 mb-1 text-xs text-emerald-600">
                      <Sparkles className="w-3 h-3" />
                      <span className="font-semibold">AI Response</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <span className={`text-xs mt-1 block ${
                    message.sender === 'user' ? 'text-emerald-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-emerald-100 rounded-2xl rounded-bl-none px-4 py-3 shadow-md">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" />
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-100">
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((qa, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(qa.action)}
                  className="text-xs px-3 py-2 bg-white hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 rounded-lg transition-all font-medium shadow-sm hover:shadow border border-emerald-100"
                >
                  {qa.text}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-emerald-100 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-3 border-2 border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 placeholder-gray-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Powered by AI • Responses may take a few seconds
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default AIChatbot