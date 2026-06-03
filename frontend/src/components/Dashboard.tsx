import React, { useState, useRef } from 'react'
import { Card, Button, Badge, LoadingSpinner } from './UI'
import {
  DiseaseIcon,
  WeatherIcon,
  IrrigationIcon,
  FertilizerIcon,
  AdvisoryIcon,
  UploadIcon,
  CheckIcon,
  AlertIcon,
} from './Icons'
import { analyzeDiseaseImage, getWeatherData, getIrrigationAdvice, getFertilizerAdvice } from '../lib/api'

interface TabType {
  id: 'disease' | 'weather' | 'irrigation' | 'fertilizer' | 'advisory'
  label: string
  icon: React.ReactNode
}

const tabs: TabType[] = [
  { id: 'disease', label: 'Disease Detection', icon: <DiseaseIcon size={20} /> },
  { id: 'weather', label: 'Weather', icon: <WeatherIcon size={20} /> },
  { id: 'irrigation', label: 'Irrigation', icon: <IrrigationIcon size={20} /> },
  { id: 'fertilizer', label: 'Fertilizer', icon: <FertilizerIcon size={20} /> },
  { id: 'advisory', label: 'Advisory', icon: <AdvisoryIcon size={20} /> },
]

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType['id']>('disease')
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800 shadow-sm">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm
                  transition-all duration-200 whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? 'bg-green-700 text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                `}
              >
                <div className="flex-shrink-0">{tab.icon}</div>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        {activeTab === 'disease' && <DiseaseDetection fileInputRef={fileInputRef} />}
        {activeTab === 'weather' && <WeatherSection />}
        {activeTab === 'irrigation' && <IrrigationSection />}
        {activeTab === 'fertilizer' && <FertilizerSection />}
        {activeTab === 'advisory' && <AdvisorySection />}
      </div>
    </div>
  )
}

const DiseaseDetection: React.FC<{ fileInputRef: React.RefObject<HTMLInputElement> }> = ({
  fileInputRef,
}) => {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    try {
      const analysis = await analyzeDiseaseImage(file)
      setResult(analysis)
    } catch (error) {
      console.error('Disease analysis error:', error)
      setResult({ error: 'Failed to analyze image' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Upload Area */}
      <Card>
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <DiseaseIcon size={24} className="text-green-700 dark:text-green-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Upload Plant Image
          </h2>
        </div>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="
            border-2 border-dashed border-slate-300 dark:border-slate-700
            rounded-xl p-8 text-center cursor-pointer
            hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10
            transition-all duration-200
          "
        >
          <div className="flex justify-center mb-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <UploadIcon size={32} className="text-green-700 dark:text-green-500" />
            </div>
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-medium mb-1">
            Click to upload or drag & drop
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            PNG, JPG, GIF up to 10MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
        {preview && (
          <div className="mt-6">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">PREVIEW</p>
            <img
              src={preview}
              alt="Preview"
              className="w-full rounded-lg border border-slate-200 dark:border-slate-700 object-cover max-h-64"
            />
          </div>
        )}
      </Card>

      {/* Results */}
      <Card>
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <CheckIcon size={24} className="text-green-700 dark:text-green-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Analysis Result
          </h2>
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <p className="text-slate-600 dark:text-slate-400 mt-4 text-sm">Analyzing image...</p>
          </div>
        ) : result ? (
          result.error ? (
            <Badge variant="error" icon={<AlertIcon size={18} />}>
              {result.error}
            </Badge>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">DISEASE NAME</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {result.disease || 'Unknown'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">CONFIDENCE</p>
                  <p className="text-xl font-semibold text-green-700 dark:text-green-500">
                    {Math.round((result.confidence || 0) * 100)}%
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">SEVERITY</p>
                  <Badge
                    variant={
                      result.severity === 'high'
                        ? 'error'
                        : result.severity === 'medium'
                          ? 'warning'
                          : 'success'
                    }
                  >
                    {result.severity || 'Unknown'}
                  </Badge>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">RECOMMENDED TREATMENT</p>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {result.treatment || 'No treatment information available'}
                </p>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">Upload an image to see results</p>
          </div>
        )}
      </Card>
    </div>
  )
}

const WeatherSection: React.FC = () => {
  const [location, setLocation] = useState('Lahore')
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    setLoading(true)
    try {
      const data = await getWeatherData(location)
      setWeather(data)
    } catch (error) {
      console.error('Weather error:', error)
      setWeather({ error: 'Failed to fetch weather' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <WeatherIcon size={24} className="text-green-700 dark:text-green-500" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Weather Information
        </h2>
      </div>
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Enter location"
          className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
        />
        <Button onClick={handleFetch} loading={loading}>
          Get Weather
        </Button>
      </div>

      {weather && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {weather.error ? (
            <Badge variant="error">{weather.error}</Badge>
          ) : (
            <>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">TEMPERATURE</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {weather.temperature}°C
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">HUMIDITY</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {weather.humidity}%
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">RAINFALL</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                  {weather.rainfall}mm
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">CONDITION</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {weather.condition}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  )
}

const IrrigationSection: React.FC = () => {
  const [crop, setCrop] = useState('wheat')
  const [location, setLocation] = useState('Lahore')
  const [advice, setAdvice] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    setLoading(true)
    try {
      const data = await getIrrigationAdvice(crop, location)
      setAdvice(data)
    } catch (error) {
      console.error('Irrigation error:', error)
      setAdvice({ error: 'Failed to fetch irrigation advice' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <IrrigationIcon size={24} className="text-green-700 dark:text-green-500" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Irrigation Advice
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-3 mb-6">
        <input
          type="text"
          value={crop}
          onChange={e => setCrop(e.target.value)}
          placeholder="Crop type"
          className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
        />
        <input
          type="text"
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Location"
          className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
        />
      </div>
      <Button onClick={handleFetch} loading={loading} className="w-full">
        Get Advice
      </Button>

      {advice && (
        <div className="mt-6 space-y-3">
          {advice.error ? (
            <Badge variant="error">{advice.error}</Badge>
          ) : (
            <>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">WATER NEEDED</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {advice.water_needed} mm
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">FREQUENCY</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {advice.frequency}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">BEST TIME</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {advice.best_time}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  )
}

const FertilizerSection: React.FC = () => {
  const [crop, setCrop] = useState('wheat')
  const [soilType, setSoilType] = useState('loam')
  const [advice, setAdvice] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    setLoading(true)
    try {
      const data = await getFertilizerAdvice(crop, soilType)
      setAdvice(data)
    } catch (error) {
      console.error('Fertilizer error:', error)
      setAdvice({ error: 'Failed to fetch fertilizer advice' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <FertilizerIcon size={24} className="text-green-700 dark:text-green-500" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Fertilizer Advice
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-3 mb-6">
        <input
          type="text"
          value={crop}
          onChange={e => setCrop(e.target.value)}
          placeholder="Crop type"
          className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
        />
        <select
          value={soilType}
          onChange={e => setSoilType(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
        >
          <option value="loam">Loam</option>
          <option value="clay">Clay</option>
          <option value="sandy">Sandy</option>
          <option value="silt">Silt</option>
        </select>
      </div>
      <Button onClick={handleFetch} loading={loading} className="w-full">
        Get Advice
      </Button>

      {advice && (
        <div className="mt-6 space-y-3">
          {advice.error ? (
            <Badge variant="error">{advice.error}</Badge>
          ) : (
            <>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">FERTILIZER TYPE</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {advice.type}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">QUANTITY</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {advice.quantity} kg/acre
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">TIMING</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  {advice.timing}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  )
}

const AdvisorySection: React.FC = () => {
  const [query, setQuery] = useState('')
  const [advice, setAdvice] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleFetch = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await response.json()
      setAdvice(data)
    } catch (error) {
      console.error('Advisory error:', error)
      setAdvice({ error: 'Failed to fetch advisory' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <AdvisoryIcon size={24} className="text-green-700 dark:text-green-500" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Agriculture Advisory
        </h2>
      </div>
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleFetch()}
          placeholder="Ask a question about farming..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
        />
        <Button onClick={handleFetch} loading={loading}>
          Ask
        </Button>
      </div>

      {advice && (
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
          {advice.error ? (
            <Badge variant="error">{advice.error}</Badge>
          ) : (
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {advice.advice}
            </p>
          )}
        </div>
      )}
    </Card>
  )
}
