

// OLLAMA LOCAL API
export const getOpenAIResponse = async (userMessage, conversationHistory = []) => {
  try {
    // Build system prompt
    const systemPrompt = `You are a civic complaint assistant for Civic Pulse.

IMPORTANT: Keep ALL responses SHORT (1-2 sentences max). Be direct and concise.

**HOW TO SUBMIT A COMPLAINT:**
1. Click "Report an Issue"
2. Select the category
3. Upload a photo
4. Click "Detect Location" to auto-detect your location
5. Click "Submit Official Report"

**HOW TO CHECK & TRACK COMPLAINTS:**
- View submitted complaints: Go to "My Complaints"
- Track complaint status: Click "Track Issue" to follow updates

Help users with: complaint submission steps, how to check/track complaints, complaint types, system info.
Use 0-1 emoji per message. Be friendly and professional.

`

    // Build conversation context
    let prompt = systemPrompt + '\n\n'
    
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach(msg => {
        prompt += `${msg.role === 'assistant' ? 'Assistant' : 'User'}: ${msg.content}\n\n`
      })
    }
    
    prompt += `User: ${userMessage}\nAssistant:`

    // Use environment variable for AI API endpoint (supports both local Ollama and cloud services)
    const aiEndpoint = import.meta.env.VITE_AI_API_URL || 'http://localhost:11434/api/generate'
    
    const response = await fetch(aiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral',
        prompt: prompt,
        stream: false,
        temperature: 0.7,
        num_predict: 100  // Limit response to ~100 tokens (1-2 sentences)
      })
    })

    if (!response.ok) {
      throw new Error(`AI service error: ${response.status}`)
    }

    const data = await response.json()
    const message = data.response || 'Unable to get response'
    
    return {
      success: true,
      message: message.trim(),
      conversationId: 'local-' + Date.now()
    }

  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('AI Service Error:', error)
    }
    return {
      success: false,
      message: "I'm having trouble connecting right now. Please try again or use our quick action buttons.",
      error: error.message
    }
  }
}

// Export based on which service you're using
export const getAIResponse = getOpenAIResponse // Change to getOpenAIResponse if using OpenAI