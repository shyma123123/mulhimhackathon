import React from 'react'
import { FileText, Search, Filter } from 'lucide-react'

const ScanResults: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-mono font-bold text-terminal-fg">Scan Results</h1>
        <FileText className="w-6 h-6 text-neon-blue" />
      </div>
      
      <div className="card-terminal">
        <p className="text-terminal-fg font-mono">Scan results dashboard coming soon...</p>
      </div>
    </div>
  )
}

export default ScanResults
