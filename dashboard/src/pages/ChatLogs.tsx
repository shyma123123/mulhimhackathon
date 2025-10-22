import React from 'react'
import { Bot, MessageSquare } from 'lucide-react'

const ChatLogs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-mono font-bold text-terminal-fg">Chat Logs</h1>
        <Bot className="w-6 h-6 text-neon-purple" />
      </div>
      
      <div className="card-terminal">
        <p className="text-terminal-fg font-mono">Chat logs dashboard coming soon...</p>
      </div>
    </div>
  )
}

export default ChatLogs
