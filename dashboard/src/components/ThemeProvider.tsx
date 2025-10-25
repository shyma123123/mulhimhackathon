import React, { useEffect } from 'react'
import { useThemeStore } from '@/stores/themeStore'

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme, language, setTheme, setLanguage } = useThemeStore()

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement
    if (theme.mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Apply language direction
    document.body.setAttribute('dir', language.direction)
    document.documentElement.setAttribute('lang', language.code)

    // Apply CSS custom properties
    root.style.setProperty('--color-bg', theme.colors.bg)
    root.style.setProperty('--color-fg', theme.colors.fg)
    root.style.setProperty('--color-primary', theme.colors.primary)
    root.style.setProperty('--color-success', theme.colors.success)
    root.style.setProperty('--color-warning', theme.colors.warning)
    root.style.setProperty('--color-error', theme.colors.error)
    root.style.setProperty('--color-muted', theme.colors.muted)
    root.style.setProperty('--color-border', theme.colors.border)
    root.style.setProperty('--color-accent', theme.colors.accent)
  }, [theme, language])

  return <>{children}</>
}

export default ThemeProvider
