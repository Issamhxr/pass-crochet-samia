'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface SiteSettings {
  // Branding
  siteName: string
  siteDescription: string
  logo: string
  favicon: string
  
  // Colors
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  foregroundColor: string
  
  // Typography
  headingFont: string
  bodyFont: string
  
  // Contact
  email: string
  phone: string
  address: string
  
  // Social
  instagram: string
  facebook: string
  tiktok: string
  
  // Footer
  footerDescription: string
  companyName: string
  
  // SEO
  metaDescription: string
  keywords: string
}

const defaultSettings: SiteSettings = {
  siteName: 'Pass-Crochet Samia',
  siteDescription: 'Univers doux et authentique de créations faites main',
  logo: '/logo.svg',
  favicon: '/favicon.ico',
  
  primaryColor: '#c9a96e',
  secondaryColor: '#f5ede4',
  accentColor: '#d4a5a5',
  backgroundColor: '#faf8f3',
  foregroundColor: '#5a4a42',
  
  headingFont: 'serif',
  bodyFont: 'sans',
  
  email: 'contact@pass-crochet.com',
  phone: '+33 (0)6 XX XX XX XX',
  address: 'France',
  
  instagram: 'https://instagram.com/pass-crochet-samia',
  facebook: 'https://facebook.com/pass-crochet-samia',
  tiktok: 'https://tiktok.com/@pass-crochet-samia',
  
  footerDescription: 'Créations faites main avec passion, patience et amour.',
  companyName: 'Pass-Crochet Samia',
  
  metaDescription: 'Découvrez l\'univers doux et authentique de Pass-Crochet Samia',
  keywords: 'crochet, amigurumi, handmade, artisanal, sacs',
}

interface SiteSettingsContextType {
  settings: SiteSettings
  updateSettings: (newSettings: Partial<SiteSettings>) => void
  resetSettings: () => void
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined)

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('siteSettings')
      if (saved) {
        try {
          setSettings(JSON.parse(saved))
        } catch (e) {
          console.error('Failed to load site settings:', e)
        }
      }
      setIsLoaded(true)
    }
  }, [])

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('siteSettings', JSON.stringify(updated))
    }
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('siteSettings')
    }
  }

  if (!isLoaded) {
    return <>{children}</>
  }

  return (
    <SiteSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (!context) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider')
  }
  return context
}
