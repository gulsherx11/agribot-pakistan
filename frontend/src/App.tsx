import React, { useState, useRef, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { AdvisoryPage } from './pages/AdvisoryPage'
import { DiseasePage } from './pages/DiseasePage'
import { WeatherPage } from './pages/WeatherPage'
import { FertilizerPage } from './pages/FertilizerPage'
import { ChatbotPage } from './pages/ChatbotPage'
import { DiseaseResponse } from './lib/api'
import './index.css'

function App() {
  const [currentPage, setCurrentPage] = useState<'advisory' | 'disease' | 'weather' | 'fertilizer' | 'chatbot'>('advisory')
  const mainRef = useRef<HTMLDivElement>(null)
  
  // Disease detection state - persists across tab switches
  const [diseaseResult, setDiseaseResult] = useState<DiseaseResponse | null>(null)
  const [diseaseTreatment, setDiseaseTreatment] = useState<string | null>(null)
  const [diseasePreview, setDiseasePreview] = useState<string | null>(null)

  // Scroll to top when page changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0
    }
  }, [currentPage])

  const resetDiseaseDetection = () => {
    setDiseaseResult(null)
    setDiseaseTreatment(null)
    setDiseasePreview(null)
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
          <main className="flex-1 overflow-y-auto" ref={mainRef}>
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
              {currentPage === 'advisory' && <AdvisoryPage />}
              {currentPage === 'disease' && (
                <DiseasePage 
                  result={diseaseResult}
                  treatment={diseaseTreatment}
                  preview={diseasePreview}
                  onResultChange={setDiseaseResult}
                  onTreatmentChange={setDiseaseTreatment}
                  onPreviewChange={setDiseasePreview}
                  onReset={resetDiseaseDetection}
                />
              )}
              {currentPage === 'weather' && <WeatherPage />}
              {currentPage === 'fertilizer' && <FertilizerPage />}
              {currentPage === 'chatbot' && <ChatbotPage />}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
