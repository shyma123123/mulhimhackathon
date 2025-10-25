import React from 'react'
import { Bot, MessageSquare } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { t } from '@/utils/translations'

const ChatLogs: React.FC = () => {
  const { language } = useThemeStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">
          {t('chatLogs', language.code)}
        </h1>
        <Bot className="w-6 h-6 text-purple-600 dark:text-purple-400" />
      </div>
      
      <div className="card-terminal">
        <p className="text-gray-900 dark:text-gray-100 font-mono">
          {language.code === 'en' 
            ? 'Chat logs dashboard coming soon...' 
            : 'لوحة تحكم سجلات الدردشة قريباً...'
          }
        </p>
      </div>
    </div>
  )
}

export default ChatLogs
