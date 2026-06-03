import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { MoonIcon, SunIcon, LeafIcon, SettingsIcon } from './Icons'
import { ApiKeyModal } from './ApiKeyModal'

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <LeafIcon size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                  AgriBot
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Smart Farming Assistant
                </p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Settings Button */}
              <button
                onClick={() => setIsApiKeyModalOpen(true)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 text-slate-700 dark:text-slate-300"
                aria-label="API Key Settings"
                title="API Key Settings"
              >
                <SettingsIcon size={20} />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200 text-slate-700 dark:text-slate-300"
                aria-label="Toggle theme"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <MoonIcon size={20} />
                ) : (
                  <SunIcon size={20} />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} />
    </>
  )
}
