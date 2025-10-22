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

const Dashboard: React.FC = () => {
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
    { name: 'Clean', value: 75, color: '#3fb950' },
    { name: 'Suspicious', value: 18, color: '#d29922' },
    { name: 'Phishing', value: 7, color: '#f85149' },
  ]

  const stats = [
    {
      title: 'Total Scans',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Shield,
      color: 'text-neon-blue'
    },
    {
      title: 'Threats Detected',
      value: '156',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: AlertTriangle,
      color: 'text-neon-red'
    },
    {
      title: 'Clean Pages',
      value: '2,691',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      color: 'text-neon-green'
    },
    {
      title: 'Active Users',
      value: '89',
      change: '+3.1%',
      changeType: 'positive' as const,
      icon: Users,
      color: 'text-neon-purple'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'threat',
      message: 'High-risk phishing attempt detected on paypal-security.com',
      time: '2 minutes ago',
      severity: 'high'
    },
    {
      id: 2,
      type: 'scan',
      message: 'Bulk scan completed: 45 pages analyzed',
      time: '5 minutes ago',
      severity: 'info'
    },
    {
      id: 3,
      type: 'chat',
      message: 'User requested explanation for flagged content',
      time: '8 minutes ago',
      severity: 'medium'
    },
    {
      id: 4,
      type: 'system',
      message: 'Model provider switched to Gemini',
      time: '12 minutes ago',
      severity: 'info'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-mono font-bold text-terminal-fg">Security Overview</h1>
          <p className="text-terminal-muted font-mono">Real-time threat detection and analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="status-online"></div>
          <span className="text-sm font-mono text-terminal-muted">Live Monitoring</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card-terminal">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-terminal-accent ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-sm font-mono ${
                stat.changeType === 'positive' ? 'text-neon-green' : 'text-neon-red'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-lg font-mono font-bold text-terminal-fg">{stat.value}</h3>
            <p className="text-sm text-terminal-muted font-mono">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scan Trends */}
        <div className="card-terminal">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-mono font-semibold text-terminal-fg">Scan Trends</h3>
            <Activity className="w-5 h-5 text-neon-green" />
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
            <h3 className="text-lg font-mono font-semibold text-terminal-fg">Threat Distribution</h3>
            <TrendingUp className="w-5 h-5 text-neon-yellow" />
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
                  <span className="text-sm font-mono text-terminal-fg">{item.name}</span>
                </div>
                <span className="text-sm font-mono text-terminal-muted">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-terminal">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-mono font-semibold text-terminal-fg">Recent Activity</h3>
          <Eye className="w-5 h-5 text-neon-blue" />
        </div>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 bg-terminal-accent rounded-md border border-terminal-border">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.severity === 'high' ? 'bg-neon-red' :
                activity.severity === 'medium' ? 'bg-neon-yellow' :
                'bg-neon-blue'
              }`}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-terminal-fg">{activity.message}</p>
                <p className="text-xs text-terminal-muted font-mono">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
