import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Theme {
  mode: 'light' | 'dark'
  colors: {
    bg: string
    fg: string
    primary: string
    success: string
    warning: string
    error: string
    muted: string
    border: string
    accent: string
  }
}

export interface Language {
  code: 'en' | 'ar'
  name: string
  direction: 'ltr' | 'rtl'
}

export interface ThemeStore {
  theme: Theme
  language: Language
  setTheme: (mode: 'light' | 'dark') => void
  setLanguage: (code: 'en' | 'ar') => void
}

const lightTheme: Theme = {
  mode: 'light',
  colors: {
    bg: '#ffffff',
    fg: '#1f2937',
    primary: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    muted: '#6b7280',
    border: '#e5e7eb',
    accent: '#f9fafb',
  }
}

const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    bg: '#0d1117',
    fg: '#c9d1d9',
    primary: '#58a6ff',
    success: '#3fb950',
    warning: '#d29922',
    error: '#f85149',
    muted: '#8b949e',
    border: '#30363d',
    accent: '#21262d',
  }
}

const languages: Record<'en' | 'ar', Language> = {
  en: {
    code: 'en',
    name: 'English',
    direction: 'ltr'
  },
  ar: {
    code: 'ar',
    name: 'العربية',
    direction: 'rtl'
  }
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: darkTheme,
      language: languages.en,
      setTheme: (mode) => set((state) => ({
        theme: mode === 'light' ? lightTheme : darkTheme
      })),
      setLanguage: (code) => set((state) => ({
        language: languages[code]
      }))
    }),
    {
      name: 'smartshield-theme',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language
      })
    }
  )
)
