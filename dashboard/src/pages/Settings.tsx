import React from 'react'
import { Settings as SettingsIcon, Shield, Database, Key } from 'lucide-react'
import { useThemeStore } from '@/stores/themeStore'
import { t } from '@/utils/translations'

const Settings: React.FC = () => {
  const { language } = useThemeStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">
          {t('settings', language.code)}
        </h1>
        <SettingsIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-terminal">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h3 className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
              {language.code === 'en' ? 'Security Settings' : 'إعدادات الأمان'}
            </h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-mono">
            {language.code === 'en' 
              ? 'Configure security parameters and detection thresholds.' 
              : 'تكوين معاملات الأمان وعتبات الكشف.'
            }
          </p>
        </div>

        <div className="card-terminal">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
              {language.code === 'en' ? 'Data Management' : 'إدارة البيانات'}
            </h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-mono">
            {language.code === 'en' 
              ? 'Manage data retention and privacy settings.' 
              : 'إدارة إعدادات الاحتفاظ بالبيانات والخصوصية.'
            }
          </p>
        </div>

        <div className="card-terminal">
          <div className="flex items-center space-x-3 mb-4">
            <Key className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
              {language.code === 'en' ? 'API Keys' : 'مفاتيح API'}
            </h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-mono">
            {language.code === 'en' 
              ? 'Configure model provider API keys and settings.' 
              : 'تكوين مفاتيح وإعدادات مزود النموذج API.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default Settings
