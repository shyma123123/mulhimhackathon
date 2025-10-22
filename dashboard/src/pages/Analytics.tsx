import React from 'react'
import { Activity, TrendingUp, AlertTriangle, Shield } from 'lucide-react'

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-mono font-bold text-terminal-fg">Analytics</h1>
        <Activity className="w-6 h-6 text-neon-green" />
      </div>
      
      <div className="card-terminal">
        <p className="text-terminal-fg font-mono">Analytics dashboard coming soon...</p>
      </div>
    </div>
  )
}

export default Analytics
