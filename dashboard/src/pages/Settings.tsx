import React from 'react'
import { Settings as SettingsIcon, Shield, Database, Key } from 'lucide-react'

const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-mono font-bold text-terminal-fg">Settings</h1>
        <SettingsIcon className="w-6 h-6 text-neon-yellow" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-terminal">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-neon-green" />
            <h3 className="text-lg font-mono font-semibold text-terminal-fg">Security Settings</h3>
          </div>
          <p className="text-terminal-muted font-mono">Configure security parameters and detection thresholds.</p>
        </div>

        <div className="card-terminal">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-5 h-5 text-neon-blue" />
            <h3 className="text-lg font-mono font-semibold text-terminal-fg">Data Management</h3>
          </div>
          <p className="text-terminal-muted font-mono">Manage data retention and privacy settings.</p>
        </div>

        <div className="card-terminal">
          <div className="flex items-center space-x-3 mb-4">
            <Key className="w-5 h-5 text-neon-purple" />
            <h3 className="text-lg font-mono font-semibold text-terminal-fg">API Keys</h3>
          </div>
          <p className="text-terminal-muted font-mono">Configure model provider API keys and settings.</p>
        </div>
      </div>
    </div>
  )
}

export default Settings
