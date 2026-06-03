import React, { useState } from 'react'
import { Card, Button } from '../components/UI'
import { getWeather, getIrrigation, WeatherResponse, IrrigationResponse, ApiError } from '../lib/api'
import { WeatherIcon, IrrigationIcon, AlertIcon } from '../components/Icons'

const CROPS = ['wheat', 'rice', 'cotton', 'maize', 'tomato', 'potato', 'sugarcane']
const CITIES = ['Lahore', 'Karachi', 'Multan', 'Faisalabad', 'Islamabad', 'Peshawar', 'Rawalpindi', 'Quetta']

export const WeatherPage: React.FC = () => {
  const [crop, setCrop] = useState('wheat')
  const [city, setCity] = useState('Lahore')
  const [loading, setLoading] = useState(false)
  const [weather, setWeather] = useState<WeatherResponse | null>(null)
  const [irrigation, setIrrigation] = useState<IrrigationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const [weatherData, irrigationData] = await Promise.all([
        getWeather(city),
        getIrrigation(crop, city),
      ])
      setWeather(weatherData)
      setIrrigation(irrigationData)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`API Error: ${err.message}`)
      } else {
        setError('Failed to fetch data. Please try again.')
      }
      console.error('Weather error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Weather & Irrigation</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Get weather conditions and irrigation planning for your crop
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3">
          <AlertIcon size={20} className="text-red-700 dark:text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-900 dark:text-red-100">{error}</p>
        </div>
      )}

      {/* Search Card */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Crop
              </label>
              <select
                value={crop}
                onChange={e => setCrop(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                {CROPS.map(c => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                City
              </label>
              <select
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                {CITIES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button type="submit" loading={loading} disabled={loading} className="w-full">
                Get Data
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <Card key={i}>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 animate-pulse"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 animate-pulse mt-4"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : weather || irrigation ? (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Weather Card */}
          {weather && (
            <Card>
              <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <WeatherIcon size={20} className="text-amber-600" />
                <h2 className="font-semibold text-slate-900 dark:text-white">Weather in {city}</h2>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400">Temperature</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {weather.temperature}°C
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400">Humidity</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {weather.humidity}%
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400">Wind Speed</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {weather.wind_speed} m/s
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <span className="text-slate-600 dark:text-slate-400">Rainfall</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {weather.rainfall}mm
                  </span>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-medium mb-1">CONDITION</p>
                  <p className="text-slate-900 dark:text-white capitalize">
                    {weather.condition}
                  </p>
                </div>

                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Pressure: </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {weather.pressure} hPa
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Irrigation Card */}
          {irrigation && (
            <Card>
              <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <IrrigationIcon size={20} className="text-blue-600" />
                <h2 className="font-semibold text-slate-900 dark:text-white">Irrigation Plan</h2>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">WATER NEEDED</p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                    {irrigation.water_needed}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">mm</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">BEST TIME TO IRRIGATE</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {irrigation.timing}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">FREQUENCY</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {irrigation.frequency}
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="text-xs text-green-700 dark:text-green-300 font-medium mb-2">ADVICE</p>
                  <p className="text-sm text-green-900 dark:text-green-100">
                    {irrigation.crop.toUpperCase()} needs {irrigation.water_needed}mm of water.
                    Irrigate {irrigation.timing}. {irrigation.frequency}.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              Select a crop and city, then click "Get Data" to see weather and irrigation information
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
