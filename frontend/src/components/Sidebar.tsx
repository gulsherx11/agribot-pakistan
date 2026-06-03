import React, { useState } from 'react'
import { DiseaseIcon, WeatherIcon, FertilizerIcon, AdvisoryIcon, ChatbotIcon } from './Icons'

interface SidebarProps {
  currentPage: 'advisory' | 'disease' | 'weather' | 'fertilizer' | 'chatbot'
  onPageChange: (page: 'advisory' | 'disease' | 'weather' | 'fertilizer' | 'chatbot') => void
}

const NAV_ITEMS = [
  { id: 'advisory', label: 'Advisory', icon: AdvisoryIcon, desc: 'Full Analysis' },
  { id: 'disease', label: 'Disease', icon: DiseaseIcon, desc: 'Detection' },
  { id: 'weather', label: 'Weather', icon: WeatherIcon, desc: 'Planning' },
  { id: 'fertilizer', label: 'Fertilizer', icon: FertilizerIcon, desc: 'Calculator' },
  { id: 'chatbot', label: 'Chatbot', icon: ChatbotIcon, desc: 'AI Assistant' },
] as const

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-40 p-3 bg-green-700 text-white rounded-full shadow-lg hover:bg-green-800 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-30 h-screen w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id as 'advisory' | 'disease' | 'weather' | 'fertilizer' | 'chatbot')
                    setIsOpen(false)
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
                    ${
                      isActive
                        ? 'bg-green-700 text-white shadow-sm'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }
                  `}
                >
                  <Icon size={20} />
                  <div className="text-left">
                    <p className="text-sm">{item.label}</p>
                    <p className={`text-xs ${isActive ? 'text-green-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {item.desc}
                    </p>
                  </div>
                </button>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              v1.0 • Smart Farming
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  )
}
