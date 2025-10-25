import React from 'react'
import { Activity, TrendingUp, AlertTriangle, Shield } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { t } from '@/utils/translations'

const Analytics: React.FC = () => {
  const { language } = useThemeStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">
          {t('analytics', language.code)}
        </h1>
        <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
      </div>
      
      <div className="card-terminal">
        <p className="text-gray-900 dark:text-gray-100 font-mono">
          {language.code === 'en' 
            ? 'Analytics dashboard coming soon...' 
            : 'لوحة تحكم التحليلات قريباً...'
          }
        </p>
      </div>
    </div>
  )
}

export default Analytics
