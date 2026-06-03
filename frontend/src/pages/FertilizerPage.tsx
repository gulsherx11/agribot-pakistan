import React, { useState } from 'react'
import { Card, Button } from '../components/UI'
import { getFertilizer, FertilizerResponse, ApiError } from '../lib/api'
import { FertilizerIcon, AlertIcon } from '../components/Icons'

const CROPS = ['wheat', 'rice', 'cotton', 'maize', 'tomato', 'potato', 'sugarcane']
const STAGES = ['sowing', 'tillering', 'heading', 'flowering', 'vegetative', 'boll']
const DISEASES = ['healthy', 'nitrogen_deficiency', 'phosphorus_deficiency']

export const FertilizerPage: React.FC = () => {
  const [formData, setFormData] = useState({
    crop: 'wheat',
    stage: 'sowing',
    area: 1.0,
    disease: 'healthy',
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FertilizerResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'area' ? (value === '' ? 1 : Math.max(0.1, parseFloat(value) || 1)) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form data
    if (!formData.crop || !formData.stage || !formData.area || formData.area < 0.1) {
      setError('Please fill in all fields correctly. Area must be at least 0.1 acres.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getFertilizer(formData.crop, formData.stage, formData.area, formData.disease)
      
      // Check if response contains error
      if ('error' in data) {
        setError(`Invalid combination: ${data.error}`)
        setResult(null)
      } else {
        setResult(data as FertilizerResponse)
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`API Error: ${err.message}`)
      } else {
        setError('Failed to calculate fertilizer. Please try again.')
      }
      setResult(null)
      console.error('Fertilizer error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Fertilizer Calculator</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Calculate fertilizer requirements for your crop
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3">
          <AlertIcon size={20} className="text-red-700 dark:text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-900 dark:text-red-100">{error}</p>
        </div>
      )}

      {/* Form Card */}
      <Card>
        <div className="mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">Fertilizer Input</h2>
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
                name="area"
                value={formData.area}
                onChange={handleChange}
                min="0.1"
                step="0.1"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
            </div>

            <div>
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
            Calculate
          </Button>
        </form>
      </Card>

      {/* Results */}
      {loading ? (
        <Card>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3 animate-pulse"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </Card>
      ) : result ? (
        <div className="space-y-6">
          {/* Fertilizer Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* UREA */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-lg p-6 border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">UREA</p>
              <p className="text-4xl font-bold text-purple-900 dark:text-purple-100 mt-3">
                {result?.fertilizer_breakdown?.urea ?? 0}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">kg</p>
              <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-700">
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  For {formData.area} acre{formData.area !== 1 ? 's' : ''} ({formData.crop})
                </p>
              </div>
            </div>

            {/* DAP */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10 rounded-lg p-6 border border-orange-200 dark:border-orange-800">
              <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">DAP</p>
              <p className="text-4xl font-bold text-orange-900 dark:text-orange-100 mt-3">
                {result?.fertilizer_breakdown?.dap ?? 0}
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">kg</p>
              <div className="mt-4 pt-4 border-t border-orange-200 dark:border-orange-700">
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  During {formData.stage} stage
                </p>
              </div>
            </div>

            {/* POTASH */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-900/10 rounded-lg p-6 border border-teal-200 dark:border-teal-800">
              <p className="text-sm text-teal-700 dark:text-teal-300 font-medium">POTASH</p>
              <p className="text-4xl font-bold text-teal-900 dark:text-teal-100 mt-3">
                {result?.fertilizer_breakdown?.potash ?? 0}
              </p>
              <p className="text-sm text-teal-600 dark:text-teal-400 mt-2">kg</p>
              <div className="mt-4 pt-4 border-t border-teal-200 dark:border-teal-700">
                <p className="text-xs text-teal-700 dark:text-teal-300">
                  Status: {formData.disease}
                </p>
              </div>
            </div>
          </div>

          {/* Advice Box */}
          <Card>
            <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <FertilizerIcon size={20} className="text-green-600" />
              <h2 className="font-semibold text-slate-900 dark:text-white">Application Guide</h2>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">CROP</p>
                  <p className="font-medium text-slate-900 dark:text-white capitalize">
                    {formData.crop}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">TOTAL AREA</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {formData.area} acre{formData.area !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-900 dark:text-green-100 leading-relaxed">
                  <strong>Application Timing:</strong> {result?.timing ?? 'N/A'}
                </p>
                <p className="text-sm text-green-900 dark:text-green-100 leading-relaxed mt-2">
                  <strong>Stage:</strong> {formData.stage.charAt(0).toUpperCase() + formData.stage.slice(1)}
                </p>
                <p className="text-sm text-green-900 dark:text-green-100 leading-relaxed mt-2">
                  Apply fertilizers in this order: UREA, DAP, then POTASH for best results.
                </p>
              </div>
            </div>
          </Card>

          {/* Summary */}
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/30 dark:to-slate-800/30 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Summary</h3>
            <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <p>
                <strong>Total Fertilizer:</strong> {result?.quantity ?? 0} kg for {formData.area} acre
                {formData.area !== 1 ? 's' : ''}
              </p>
              <p>
                <strong>Crop:</strong> {formData.crop} at {formData.stage} stage
              </p>
              <p>
                <strong>Disease Status:</strong> {formData.disease}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              Fill in the form and click "Calculate" to see fertilizer recommendations
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
