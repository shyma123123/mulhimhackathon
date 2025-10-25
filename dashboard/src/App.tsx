import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

import Layout from '@/components/Layout'
import ThemeProvider from '@/components/ThemeProvider'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Analytics from '@/pages/Analytics'
import Settings from '@/pages/Settings'
import ScanResults from '@/pages/ScanResults'
import ChatLogs from '@/pages/ChatLogs'
import Reports from '@/pages/Reports'

function App() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <Login />
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white dark:bg-gray-900 matrix-bg">
        <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/scans" element={<ScanResults />} />
                <Route path="/chat" element={<ChatLogs />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
        </Layout>
      </div>
    </ThemeProvider>
  )
}

export default App
