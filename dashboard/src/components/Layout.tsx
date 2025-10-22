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
  Bot
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: BarChart3 },
    { name: 'Analytics', href: '/analytics', icon: Activity },
    { name: 'Scan Results', href: '/scans', icon: FileText },
    { name: 'Chat Logs', href: '/chat', icon: Bot },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-terminal-bg">
      {/* Sidebar */}
      <div className="w-64 bg-terminal-accent border-r border-terminal-border flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-terminal-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-mono font-bold text-terminal-fg">SmartShield</h1>
              <p className="text-xs text-terminal-muted">Security Dashboard</p>
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
                    ? 'bg-terminal-primary text-white glow-blue'
                    : 'text-terminal-fg hover:bg-terminal-border hover:text-terminal-primary'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-terminal-border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-terminal-primary rounded-full flex items-center justify-center">
              <span className="text-white font-mono text-sm font-bold">
                {user?.email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-mono text-terminal-fg truncate">
                {user?.email}
              </p>
              <p className="text-xs text-terminal-muted capitalize">
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-mono text-terminal-muted hover:text-terminal-error hover:bg-terminal-border rounded-md transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-terminal-accent border-b border-terminal-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Terminal className="w-5 h-5 text-neon-green" />
              <h2 className="text-lg font-mono font-semibold text-terminal-fg">
                {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="status-online"></div>
                <span className="text-sm font-mono text-terminal-muted">System Online</span>
              </div>
              <div className="text-sm font-mono text-terminal-muted">
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
