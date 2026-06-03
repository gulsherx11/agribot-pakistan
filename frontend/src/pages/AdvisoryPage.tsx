import React, { useState } from 'react'
import { Card, Button, Badge, LoadingSpinner } from '../components/UI'
import { analyzeAll, AnalysisResponse, ApiError } from '../lib/api'
import { AlertIcon } from '../components/Icons'

const CROPS = ['wheat', 'rice', 'cotton', 'maize', 'tomato', 'potato', 'sugarcane']
const CITIES = ['Lahore', 'Karachi', 'Multan', 'Faisalabad', 'Islamabad', 'Peshawar', 'Rawalpindi', 'Quetta']
const STAGES = ['sowing', 'tillering', 'heading', 'flowering', 'vegetative', 'boll']
const DISEASES = ['healthy', 'nitrogen_deficiency', 'phosphorus_deficiency']

export const AdvisoryPage: React.FC = () => {
  const [formData, setFormData] = useState({
    crop: 'wheat',
    city: 'Lahore',
    stage: 'sowing',
    area_acres: 1.0,
    disease: 'healthy',
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'area_acres' ? (value === '' ? 1 : Math.max(0.1, parseFloat(value) || 1)) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form data
    if (!formData.crop || !formData.city || !formData.stage || !formData.area_acres || formData.area_acres < 0.1) {
      setError('Please fill in all fields correctly. Area must be at least 0.1 acres.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await analyzeAll(formData)
      setResult(data)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`API Error: ${err.message}`)
      } else {
        setError('Failed to get advisory. Please check your connection.')
      }
      console.error('Advisory error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3">
          <AlertIcon size={20} className="text-red-700 dark:text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900 dark:text-red-100">{error}</p>
            <p className="text-sm text-red-800 dark:text-red-200 mt-1">
              Running in demo mode — showing sample data below
            </p>
          </div>
        </div>
      )}

      {/* Form Card */}
      <Card>
        <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Farm Analysis</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Get comprehensive advisory based on your farm conditions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Crop Type
              </label>
              <select
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                {CROPS.map(crop => (
                  <option key={crop} value={crop}>
                    {crop.charAt(0).toUpperCase() + crop.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                City
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                {CITIES.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Growth Stage
              </label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                {STAGES.map(stage => (
                  <option key={stage} value={stage}>
                    {stage.charAt(0).toUpperCase() + stage.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Area (acres)
              </label>
              <input
                type="number"
                name="area_acres"
                value={formData.area_acres}
                onChange={handleChange}
                min="0.1"
                step="0.1"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Disease Status
              </label>
              <select
                name="disease"
                value={formData.disease}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              >
                {DISEASES.map(disease => (
                  <option key={disease} value={disease}>
                    {disease.replace(/_/g, ' ').charAt(0).toUpperCase() + disease.slice(1).replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button type="submit" loading={loading} disabled={loading} className="w-full mt-6">
            Get AI Advisory
          </Button>
        </form>
      </Card>

      {/* Results */}
      {loading && (
        <div className="grid md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <div className="space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 animate-pulse"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 animate-pulse mt-4"></div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {result && !loading && (
        <div className="space-y-6">
          {/* Weather Card */}
          <Card>
            <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white">Weather Conditions</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">TEMPERATURE</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                  {result.weather.temperature}°C
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">HUMIDITY</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                  {result.weather.humidity}%
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">RAINFALL</p>
                <p className="text-lg font-semibold text-slate-900 dark:text-white mt-1">
                  {result.weather.rainfall}mm
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">CONDITION</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
                  {result.weather.condition}
                </p>
              </div>
            </div>
          </Card>

          {/* Irrigation Card */}
          <Card>
            <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white">Irrigation Plan</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">WATER NEEDED</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100 mt-2">
                  {result.irrigation.water_needed}mm
                </p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">FREQUENCY</p>
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100 mt-2">
                  {result.irrigation.frequency}
                </p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800">
                <p className="text-xs text-emerald-700 dark:text-emerald-300 font-medium">BEST TIME</p>
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mt-2">
                  {result.irrigation.timing}
                </p>
              </div>
            </div>
          </Card>

          {/* Fertilizer Card */}
          <Card>
            <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold text-slate-900 dark:text-white">Fertilizer Recommendation</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">UREA</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                  {result.fertilizer.fertilizer_breakdown.urea || 0}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">kg</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">DAP</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-2">
                  {result.fertilizer.fertilizer_breakdown.dap || 0}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">kg</p>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/10 rounded-lg p-4 border border-teal-200 dark:border-teal-800">
                <p className="text-sm text-teal-700 dark:text-teal-300 font-medium">POTASH</p>
                <p className="text-3xl font-bold text-teal-900 dark:text-teal-100 mt-2">
                  {result.fertilizer.fertilizer_breakdown.potash || 0}
                </p>
                <p className="text-xs text-teal-600 dark:text-teal-400 mt-1">kg</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <strong>Total:</strong> {result.fertilizer.quantity} kg | <strong>Timing:</strong> {result.fertilizer.timing} | <strong>Stage:</strong> {result.fertilizer.stage}
            </p>
          </Card>

          {/* AI Advisory Box */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">AI Advisory</h3>
            <div 
              className="text-green-800 dark:text-green-200 leading-relaxed whitespace-pre-wrap"
              dir="auto"
              style={{ direction: 'auto', textAlign: 'left' }}
            >
              {result.final_advice}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
