import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  role: string
  orgId?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User, token: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          // For demo purposes, accept any credentials
          // In production, this would make an API call to the backend
          const mockUser: User = {
            id: '1',
            email,
            role: 'admin',
            orgId: 'default'
          }
          
          const mockToken = 'mock-jwt-token'
          
          set({
            user: mockUser,
            token: mockToken,
            isAuthenticated: true
          })
        } catch (error) {
          throw new Error('Login failed')
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
      },

      setUser: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true
        })
      }
    }),
    {
      name: 'smartshield-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
