import React, { useState } from 'react'
import { Shield, Terminal, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import toast from 'react-hot-toast'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    setIsLoading(true)
    
    try {
      await login(email, password)
      toast.success('Login successful!')
    } catch (error) {
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-terminal-bg matrix-bg flex items-center justify-center p-4">
      <div className="terminal-window w-full max-w-md">
        <div className="terminal-header">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-neon rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-lg font-mono font-bold text-terminal-fg">SmartShield</h1>
              <p className="text-xs text-terminal-muted">Security Dashboard</p>
            </div>
          </div>
        </div>
        
        <div className="terminal-content">
          <div className="mb-6">
            <Terminal className="w-12 h-12 text-neon-green mx-auto mb-4" />
            <h2 className="text-xl font-mono font-bold text-terminal-fg text-center mb-2">
              Welcome Back
            </h2>
            <p className="text-terminal-muted text-center text-sm font-mono">
              Sign in to access the security dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-mono text-terminal-fg mb-2">
                Email Address
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
              <label htmlFor="password" className="block text-sm font-mono text-terminal-fg mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-terminal w-full pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-terminal-muted hover:text-terminal-fg"
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
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <Terminal className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-4 bg-terminal-accent rounded-md border border-terminal-border">
            <h3 className="text-sm font-mono font-semibold text-terminal-fg mb-2">
              Demo Credentials:
            </h3>
            <div className="space-y-1 text-xs font-mono text-terminal-muted">
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
