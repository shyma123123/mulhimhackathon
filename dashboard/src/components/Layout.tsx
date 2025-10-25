import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  BarChart3, 
  Shield, 
  MessageSquare, 
  Settings, 
  LogOut,
  Terminal,
  Activity,
  FileText,
  Bot,
  FileBarChart
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { t } from '@/utils/translations'
import ThemeToggle from './ThemeToggle'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { language } = useThemeStore()

  const navigation = [
    { name: t('dashboard', language.code), href: '/', icon: BarChart3 },
    { name: t('analytics', language.code), href: '/analytics', icon: Activity },
    { name: t('scanResults', language.code), href: '/scans', icon: FileText },
    { name: t('chatLogs', language.code), href: '/chat', icon: Bot },
    { name: t('reports', language.code), href: '/reports', icon: FileBarChart },
    { name: t('settings', language.code), href: '/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-mono font-bold text-gray-900 dark:text-gray-100">SmartShield</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard', language.code)}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-md font-mono text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 dark:bg-blue-500 text-white glow-blue'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-mono text-sm font-bold">
                {user?.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-mono text-gray-900 dark:text-gray-100 truncate">
                {user?.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-mono text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('logout', language.code)}</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Terminal className="w-5 h-5 text-green-600 dark:text-green-400" />
              <h2 className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
                {navigation.find(item => item.href === location.pathname)?.name || t('dashboard', language.code)}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="flex items-center space-x-2">
                <div className="status-online"></div>
                <span className="text-sm font-mono text-gray-500 dark:text-gray-400">{t('online', language.code)}</span>
              </div>
              <div className="text-sm font-mono text-gray-500 dark:text-gray-400">
                {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout
