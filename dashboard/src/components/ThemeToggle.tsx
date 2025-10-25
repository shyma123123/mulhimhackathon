import React from 'react'
import { Sun, Moon, Globe } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { t } from '@/utils/translations'

export const ThemeToggle: React.FC = () => {
  const { theme, language, setTheme, setLanguage } = useThemeStore()

  const toggleTheme = () => {
    setTheme(theme.mode === 'light' ? 'dark' : 'light')
  }

  const toggleLanguage = () => {
    setLanguage(language.code === 'en' ? 'ar' : 'en')
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="flex items-center space-x-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        title={t('language', language.code)}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-mono">
          {language.code === 'en' ? 'عربي' : 'EN'}
        </span>
      </button>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="flex items-center space-x-1 px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
        title={theme.mode === 'light' ? t('dark', language.code) : t('light', language.code)}
      >
        {theme.mode === 'light' ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
        <span className="text-sm font-mono">
          {theme.mode === 'light' ? t('dark', language.code) : t('light', language.code)}
        </span>
      </button>
    </div>
  )
}

export default ThemeToggle
