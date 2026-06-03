import React from 'react'

interface IconProps {
  size?: number
  className?: string
}

export const DiseaseIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5M12 15v1" strokeLinecap="round" />
    <circle cx="9" cy="10" r="1" fill="currentColor" />
    <circle cx="15" cy="10" r="1" fill="currentColor" />
    <path d="M9 14c1 .5 2 .5 3 .5s2 0 3-.5" strokeLinecap="round" />
  </svg>
)

export const WeatherIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="12" cy="13" r="6" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="19.1" y1="5.9" x2="20.5" y2="4.5" />
    <line x1="23" y1="13" x2="21" y2="13" />
    <line x1="19.1" y1="20.1" x2="20.5" y2="21.5" />
    <line x1="12" y1="23" x2="12" y2="21" />
    <line x1="4.9" y1="20.1" x2="3.5" y2="21.5" />
    <line x1="1" y1="13" x2="3" y2="13" />
    <line x1="4.9" y1="5.9" x2="3.5" y2="4.5" />
  </svg>
)

export const IrrigationIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 2c0 2.5-2 5-5 8-2 2.5-3 5-3 7.5 0 4 3 7 8 7s8-3 8-7c0-2.5-1-5-3-7.5-3-3-5-5.5-5-8z" />
    <path d="M12 8v4" strokeLinecap="round" />
    <path d="M8 9h8" strokeLinecap="round" />
  </svg>
)

export const FertilizerIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 2v8M8 6h8M7 18c0 2.2 1.8 4 4 4s4-1.8 4-4" />
    <path d="M6 14h12v2H6z" />
    <path d="M9 11h6v1H9z" />
  </svg>
)

export const AdvisoryIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z" />
    <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
  </svg>
)

export const UploadIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 2v12M7 9l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 18h18" strokeLinecap="round" />
    <path d="M3 21h18" strokeLinecap="round" />
  </svg>
)

export const CheckIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const AlertIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 2L2 20h20L12 2z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 9v4M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const MoonIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
)

export const SunIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export const LeafIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M12 2c0 0-8 6-8 12 0 4.4 3.6 8 8 8s8-3.6 8-8c0-6-8-12-8-12z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 7v8" strokeLinecap="round" />
  </svg>
)

export const LoadingSpinner: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`animate-spin ${className}`}>
    <circle cx="12" cy="12" r="10" opacity="0.3" />
    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
  </svg>
)

export const ChatbotIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="9" cy="10" r="1" fill="currentColor" />
    <circle cx="12" cy="10" r="1" fill="currentColor" />
    <circle cx="15" cy="10" r="1" fill="currentColor" />
  </svg>
)

export const SendIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16396759 C3.34915502,0.9 2.40734225,0.9 1.77946707,1.4129066 C0.994623095,2.0460397 0.837654326,3.1368183 1.15159189,3.92230524 L3.03521743,10.3633 C3.03521743,10.5204 3.34915502,10.5204 3.50612381,10.5204 L16.6915026,11.3059 C16.6915026,11.3059 17.1624089,11.3059 17.1624089,11.8188065 L17.1624089,10.9314 C17.1624089,10.5204 17.1624089,10.3633 17.1624089,10.3633 Z" fill="currentColor" />
  </svg>
)

export const SettingsIcon: React.FC<IconProps> = ({ size = 24, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.12 2.12l4.24 4.24M1 12h6m6 0h6m-2.78 7.78l-4.24-4.24m-2.12-2.12L3.46 3.46" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
