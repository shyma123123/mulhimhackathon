import React, { useState } from 'react'
import { Shield, Terminal, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useThemeStore } from '@/stores/themeStore'
import { t } from '@/utils/translations'
import ThemeToggle from '@/components/ThemeToggle'
import toast from 'react-hot-toast'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuthStore()
  const { language } = useThemeStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error(language.code === 'en' ? 'Please enter both email and password' : 'يرجى إدخال البريد الإلكتروني وكلمة المرور')
      return
    }

    setIsLoading(true)
    
    try {
      await login(email, password)
      toast.success(language.code === 'en' ? 'Login successful!' : 'تم تسجيل الدخول بنجاح!')
    } catch (error) {
      toast.error(language.code === 'en' ? 'Login failed. Please try again.' : 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 matrix-bg flex items-center justify-center p-4">
      <div className="terminal-window w-full max-w-md">
        <div className="terminal-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-lg font-mono font-bold text-gray-900 dark:text-gray-100">SmartShield</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('dashboard', language.code)}</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
        
        <div className="terminal-content">
          <div className="mb-6">
            <Terminal className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-mono font-bold text-gray-900 dark:text-gray-100 text-center mb-2">
              {t('welcomeBack', language.code)}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm font-mono">
              {language.code === 'en' 
                ? 'Sign in to access the security dashboard'
                : 'سجل الدخول للوصول إلى لوحة التحكم الأمنية'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-mono text-gray-900 dark:text-gray-100 mb-2">
                {language.code === 'en' ? 'Email Address' : 'عنوان البريد الإلكتروني'}
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-terminal w-full"
                placeholder="admin@smartshield.local"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-mono text-gray-900 dark:text-gray-100 mb-2">
                {language.code === 'en' ? 'Password' : 'كلمة المرور'}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-terminal w-full pr-10"
                  placeholder={language.code === 'en' ? 'Enter your password' : 'أدخل كلمة المرور'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="loading"></div>
                  <span>{language.code === 'en' ? 'Signing in...' : 'جاري تسجيل الدخول...'}</span>
                </>
              ) : (
                <>
                  <Terminal className="w-4 h-4" />
                  <span>{language.code === 'en' ? 'Sign In' : 'تسجيل الدخول'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
            <h3 className="text-sm font-mono font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {language.code === 'en' ? 'Demo Credentials:' : 'بيانات الدخول التجريبية:'}
            </h3>
            <div className="space-y-1 text-xs font-mono text-gray-500 dark:text-gray-400">
              <p>Email: admin@smartshield.local</p>
              <p>Password: admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
