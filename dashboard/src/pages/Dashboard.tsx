import React from 'react'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  TrendingUp,
  Users,
  Eye,
  MessageSquare
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useThemeStore } from '@/stores/themeStore'
import { t } from '@/utils/translations'

const Dashboard: React.FC = () => {
  const { language } = useThemeStore()

  // Mock data for demonstration
  const scanTrendsData = [
    { time: '00:00', scans: 12, threats: 2 },
    { time: '04:00', scans: 8, threats: 1 },
    { time: '08:00', scans: 45, threats: 8 },
    { time: '12:00', scans: 67, threats: 12 },
    { time: '16:00', scans: 89, threats: 15 },
    { time: '20:00', scans: 34, threats: 6 },
  ]

  const threatDistributionData = [
    { name: t('clean', language.code), value: 75, color: '#10b981' },
    { name: t('medium', language.code), value: 18, color: '#f59e0b' },
    { name: t('high', language.code), value: 7, color: '#ef4444' },
  ]

  const stats = [
    {
      title: t('totalScans', language.code),
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Shield,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: t('threatsDetected', language.code),
      value: '156',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400'
    },
    {
      title: t('clean', language.code),
      value: '2,691',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: t('activeUsers', language.code),
      value: '89',
      change: '+3.1%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-purple-600 dark:text-purple-400'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'threat',
      message: language.code === 'en' 
        ? 'High-risk phishing attempt detected on paypal-security.com'
        : 'تم اكتشاف محاولة تصيد احتيالي عالية المخاطر على paypal-security.com',
      time: language.code === 'en' ? '2 minutes ago' : 'منذ دقيقتين',
      severity: 'high'
    },
    {
      id: 2,
      type: 'scan',
      message: language.code === 'en' 
        ? 'Bulk scan completed: 45 pages analyzed'
        : 'تم إكمال الفحص المجمع: تم تحليل 45 صفحة',
      time: language.code === 'en' ? '5 minutes ago' : 'منذ 5 دقائق',
      severity: 'info'
    },
    {
      id: 3,
      type: 'chat',
      message: language.code === 'en' 
        ? 'User requested explanation for flagged content'
        : 'طلب المستخدم شرحاً للمحتوى المميز',
      time: language.code === 'en' ? '8 minutes ago' : 'منذ 8 دقائق',
      severity: 'medium'
    },
    {
      id: 4,
      type: 'system',
      message: language.code === 'en' 
        ? 'Model provider switched to Gemini'
        : 'تم تبديل مزود النموذج إلى Gemini',
      time: language.code === 'en' ? '12 minutes ago' : 'منذ 12 دقيقة',
      severity: 'info'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-gray-900 dark:text-gray-100">
            {language.code === 'en' ? 'Security Overview' : 'نظرة عامة على الأمان'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-mono">
            {language.code === 'en' ? 'Real-time threat detection and analysis' : 'كشف وتحليل التهديدات في الوقت الفعلي'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="status-online"></div>
          <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
            {language.code === 'en' ? 'Live Monitoring' : 'المراقبة المباشرة'}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card-terminal">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-600 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-sm font-mono ${
                stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-lg font-mono font-bold text-gray-900 dark:text-gray-100">{stat.value}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scan Trends */}
        <div className="card-terminal">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
              {language.code === 'en' ? 'Scan Trends' : 'اتجاهات الفحص'}
            </h3>
            <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scanTrendsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
                <XAxis 
                  dataKey="time" 
                  stroke="#8b949e"
                  fontSize={12}
                  fontFamily="JetBrains Mono"
                />
                <YAxis 
                  stroke="#8b949e"
                  fontSize={12}
                  fontFamily="JetBrains Mono"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                    color: '#c9d1d9',
                    fontFamily: 'JetBrains Mono'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="scans" 
                  stroke="#58a6ff" 
                  strokeWidth={2}
                  dot={{ fill: '#58a6ff', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="threats" 
                  stroke="#f85149" 
                  strokeWidth={2}
                  dot={{ fill: '#f85149', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Distribution */}
        <div className="card-terminal">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
              {language.code === 'en' ? 'Threat Distribution' : 'توزيع التهديدات'}
            </h3>
            <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {threatDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#161b22',
                    border: '1px solid #30363d',
                    borderRadius: '8px',
                    color: '#c9d1d9',
                    fontFamily: 'JetBrains Mono'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {threatDistributionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-mono text-gray-900 dark:text-gray-100">{item.name}</span>
                </div>
                <span className="text-sm font-mono text-gray-500 dark:text-gray-400">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-terminal">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-mono font-semibold text-gray-900 dark:text-gray-100">
            {language.code === 'en' ? 'Recent Activity' : 'النشاط الأخير'}
          </h3>
          <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.severity === 'high' ? 'bg-red-500' :
                activity.severity === 'medium' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-gray-900 dark:text-gray-100">{activity.message}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
