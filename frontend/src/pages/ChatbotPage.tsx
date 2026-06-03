import React, { useState, useRef, useEffect } from 'react'
import { Card, Button } from '../components/UI'
import { SendIcon, LeafIcon, DiseaseIcon, WeatherIcon, FertilizerIcon, SettingsIcon } from '../components/Icons'
import { sendChatMessage, hasApiKey, hasWeatherApiKey } from '../lib/api'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

export const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your agricultural assistant. I can help you with disease detection, fertilizer recommendations, weather insights, and general farming advice. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiKeySet, setApiKeySet] = useState(hasApiKey())
  const [weatherKeySet, setWeatherKeySet] = useState(hasWeatherApiKey())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const prevMessageCount = useRef(1)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    // Only scroll when a new message is added, not on initial render
    if (messages.length > prevMessageCount.current) {
      scrollToBottom()
    }
    prevMessageCount.current = messages.length
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    if (!apiKeySet) {
      setError('Please set your API key in settings first')
      return
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    }

    const userInput = input
    const previousMessages = messages  // Save messages before updating state
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      // Build conversation history for the API (exclude the initial greeting)
      const conversationHistory = previousMessages
        .filter(msg => msg.id !== '1') // Skip the initial greeting
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))

      // Call the API
      const response = await sendChatMessage({
        message: userInput,
        conversation_history: conversationHistory
      })

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response'
      setError(errorMessage)
      const errorBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorBotMessage])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        type: 'bot',
        content: 'Hello! I\'m your agricultural assistant. I can help you with disease detection, fertilizer recommendations, weather insights, and general farming advice. How can I help you today?',
        timestamp: new Date()
      }
    ])
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Agricultural Chatbot</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Chat with our AI assistant for farming advice and guidance
        </p>
      </div>

      {!apiKeySet && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-lg p-4 flex items-start gap-3">
          <SettingsIcon size={20} className="text-amber-700 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 dark:text-amber-200">Groq API Key Required</h3>
            <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
              Please add your Groq API key in settings to start chatting. Click the settings icon in the header.
            </p>
          </div>
        </div>
      )}

      {apiKeySet && !weatherKeySet && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4 flex items-start gap-3">
          <WeatherIcon size={20} className="text-blue-700 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-200">OpenWeather API Key Missing</h3>
            <p className="text-sm text-blue-800 dark:text-blue-300 mt-1">
              Add your OpenWeather API key in settings to enable weather-related features.
            </p>
          </div>
        </div>
      )}

      <Card>
        <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="font-semibold text-slate-900 dark:text-white">Conversation</h2>
          <button
            onClick={clearChat}
            className="text-sm px-3 py-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
          >
            Clear
          </button>
        </div>

        {/* Messages Container */}
        <div className="h-96 overflow-y-auto mb-4 space-y-4 pr-2">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-green-600 text-white rounded-br-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.type === 'user'
                      ? 'text-green-100'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-slate-800 px-4 py-3 rounded-lg rounded-bl-none">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading || !apiKeySet}
            placeholder={apiKeySet ? "Type your question..." : "Please set your Groq API key first..."}
            className="flex-1 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || !apiKeySet}
            className="px-4 py-3 bg-green-700 hover:bg-green-800 disabled:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <SendIcon size={20} />
          </button>
        </form>
      </Card>

      {/* Info Section */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <LeafIcon size={20} className="text-green-700 dark:text-green-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Tips</h3>
          </div>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <li>• Ask about crop diseases and treatment options</li>
            <li>• Get fertilizer recommendations for your crops</li>
            <li>• Check weather-based farming tips</li>
            <li>• Get general farming advice and best practices</li>
          </ul>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-3">
            <DiseaseIcon size={20} className="text-green-700 dark:text-green-500" />
            <h3 className="font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            For specific tasks, use the dedicated sections:
          </p>
          <div className="flex flex-wrap gap-2">
            <button className="text-xs px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center gap-1">
              <DiseaseIcon size={14} />
              Disease
            </button>
            <button className="text-xs px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1">
              <WeatherIcon size={14} />
              Weather
            </button>
            <button className="text-xs px-3 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors flex items-center gap-1">
              <FertilizerIcon size={14} />
              Fertilizer
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
