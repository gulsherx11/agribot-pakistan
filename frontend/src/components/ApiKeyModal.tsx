import React, { useState, useEffect } from 'react'
import { Card } from './UI'

interface ApiKeyModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [groqKey, setGroqKey] = useState('')
  const [weatherKey, setWeatherKey] = useState('')
  const [showGroqKey, setShowGroqKey] = useState(false)
  const [showWeatherKey, setShowWeatherKey] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load API keys from localStorage
    const savedGroqKey = localStorage.getItem('groq_api_key')
    const savedWeatherKey = localStorage.getItem('openweather_api_key')
    if (savedGroqKey) {
      setGroqKey(savedGroqKey)
    }
    if (savedWeatherKey) {
      setWeatherKey(savedWeatherKey)
    }
  }, [isOpen])

  const handleSave = () => {
    if (!groqKey.trim() || !weatherKey.trim()) {
      alert('Please enter both API keys')
      return
    }

    localStorage.setItem('groq_api_key', groqKey)
    localStorage.setItem('openweather_api_key', weatherKey)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onClose()
    }, 1500)
  }

  const handleClearGroq = () => {
    if (window.confirm('Are you sure you want to delete your Groq API key?')) {
      setGroqKey('')
      localStorage.removeItem('groq_api_key')
    }
  }

  const handleClearWeather = () => {
    if (window.confirm('Are you sure you want to delete your OpenWeather API key?')) {
      setWeatherKey('')
      localStorage.removeItem('openweather_api_key')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            API Key Settings
          </h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-5">
          {/* Groq API Key */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Groq API Key <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Get your free API key from{' '}
              <a
                href="https://console.groq.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 dark:text-green-400 hover:underline"
              >
                console.groq.com
              </a>
            </p>
            <div className="relative">
              <input
                type={showGroqKey ? 'text' : 'password'}
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="w-full px-4 py-2 pr-16 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowGroqKey(!showGroqKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 whitespace-nowrap"
              >
                {showGroqKey ? 'Hide' : 'Show'}
              </button>
            </div>
            {groqKey && (
              <button
                onClick={handleClearGroq}
                className="mt-2 text-xs px-2 py-1 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* OpenWeather API Key */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              OpenWeather API Key <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              Get your free API key from{' '}
              <a
                href="https://openweathermap.org/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                openweathermap.org
              </a>
            </p>
            <div className="relative">
              <input
                type={showWeatherKey ? 'text' : 'password'}
                value={weatherKey}
                onChange={(e) => setWeatherKey(e.target.value)}
                placeholder="Enter your OpenWeather API key..."
                className="w-full px-4 py-2 pr-12 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowWeatherKey(!showWeatherKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {showWeatherKey ? 'Hide' : 'Show'}
              </button>
            </div>
            {weatherKey && (
              <button
                onClick={handleClearWeather}
                className="mt-2 text-xs px-2 py-1 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 rounded-lg p-3">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              💡 <strong>Tip:</strong> Your API keys are stored locally in your browser only. They're never sent to our servers or shared with anyone.
            </p>
          </div>

          {saved && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-3">
              <p className="text-sm text-green-800 dark:text-green-300">
                ✓ API keys saved successfully!
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
