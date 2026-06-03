import React, { useState, useRef } from 'react'
import { Card, Button, Badge } from '../components/UI'
import { detectDisease, DiseaseResponse, ApiError, getDiseaseTreatment } from '../lib/api'
import { UploadIcon, CheckIcon, AlertIcon } from '../components/Icons'

interface DiseasePageProps {
  result: DiseaseResponse | null
  treatment: string | null
  preview: string | null
  onResultChange: (result: DiseaseResponse | null) => void
  onTreatmentChange: (treatment: string | null) => void
  onPreviewChange: (preview: string | null) => void
  onReset: () => void
}

export const DiseasePage: React.FC<DiseasePageProps> = ({
  result,
  treatment,
  preview,
  onResultChange,
  onTreatmentChange,
  onPreviewChange,
  onReset
}) => {
  const [loading, setLoading] = useState(false)
  const [treatmentLoading, setTreatmentLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    setLoading(true)
    setError(null)
    onResultChange(null)
    onTreatmentChange(null)

    // Show preview
    const reader = new FileReader()
    reader.onload = e => onPreviewChange(e.target?.result as string)
    reader.readAsDataURL(file)

    try {
      const analysis = await detectDisease(file)
      onResultChange(analysis)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Detection failed: ${err.message}`)
      } else {
        setError('Failed to analyze image. Please try again.')
      }
      console.error('Disease detection error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleGetTreatment = async () => {
    if (!result) return

    setTreatmentLoading(true)
    try {
      const response = await getDiseaseTreatment(result.crop, result.disease, result.severity)
      onTreatmentChange(response.treatment)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(`Failed to get treatment: ${err.message}`)
      } else {
        setError('Failed to get treatment advice. Please try again.')
      }
      console.error('Treatment error:', err)
    } finally {
      setTreatmentLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Disease Detection</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Upload a plant image to identify diseases and get treatment recommendations
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex gap-3">
          <AlertIcon size={20} className="text-red-700 dark:text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900 dark:text-red-100">{error}</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upload Area */}
        <Card>
          <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white">Upload Image</h2>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={e => e.preventDefault()}
            onDrop={handleDragDrop}
            className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all duration-200"
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
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 object-cover max-h-72"
              />
            </div>
          )}
        </Card>

        {/* Results */}
        <Card>
          <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white">Analysis Result</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin">
                <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-700 border-t-green-600 rounded-full"></div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-4">Analyzing image...</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">CROP TYPE</p>
                <p className="text-lg font-semibold text-green-700 dark:text-green-500 capitalize">
                  {result.crop}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">DISEASE NAME</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white capitalize">
                  {result.disease}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">CONFIDENCE</p>
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-green-700 dark:text-green-500">
                      {Math.round((result.confidence || 0) * 100)}%
                    </p>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-3">
                    <div
                      className="bg-green-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${Math.round((result.confidence || 0) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">SEVERITY</p>
                  <Badge
                    variant={
                      result.severity === 'high'
                        ? 'error'
                        : result.severity === 'medium'
                          ? 'warning'
                          : 'success'
                    }
                  >
                    {result.severity?.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {(result.confidence || 0) < 0.6 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 flex gap-2">
                  <AlertIcon size={18} className="text-amber-700 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-900 dark:text-amber-100">
                    Image is unclear. Please retake in good lighting for better accuracy.
                  </p>
                </div>
              )}

              <button
                onClick={handleGetTreatment}
                disabled={treatmentLoading}
                className="w-full bg-green-700 hover:bg-green-800 disabled:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {treatmentLoading ? (
                  <>
                    <div className="animate-spin">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    </div>
                    Getting Treatment...
                  </>
                ) : (
                  'Suggest Treatment'
                )}
              </button>

              {treatment && (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">RECOMMENDED TREATMENT</p>
                  <div 
                    className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap"
                    dir="auto"
                  >
                    {treatment}
                  </div>
                </div>
              )}

              <button
                onClick={onReset}
                className="w-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Start New Detection
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckIcon size={32} className="text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-slate-500 dark:text-slate-400">Upload an image to analyze</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
