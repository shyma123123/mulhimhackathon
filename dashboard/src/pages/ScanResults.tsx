import React from 'react'
import { FileText, Search, Filter } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { t } from '@/utils/translations'

const ScanResults: React.FC = () => {
  const { language } = useThemeStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">
          {t('scanResults', language.code)}
        </h1>
        <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      
      <div className="card-terminal">
        <p className="text-gray-900 dark:text-gray-100 font-mono">
          {language.code === 'en' 
            ? 'Scan results dashboard coming soon...' 
            : 'لوحة تحكم نتائج الفحص قريباً...'
          }
        </p>
      </div>
    </div>
  )
}

export default ScanResults
