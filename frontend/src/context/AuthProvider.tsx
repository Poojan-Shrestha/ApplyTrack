import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User, AuthContextType } from '../types'
import { AuthContext } from './AuthContext'
import { authService } from '../services/auth.service'
import toast from 'react-hot-toast'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await authService.getCurrentUser()
      setUser(currentUser)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const user = await authService.login(email, password)
      setUser(user)
      toast.success('Welcome back!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      throw error
    }
  }

  const register = async (email: string, password: string, fullName: string) => {
    try {
      const user = await authService.register(email, password, fullName)
      setUser(user)
      toast.success('Account created successfully!')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      toast.success('Logged out successfully')
    } catch {
      toast.error('Logout failed')
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(data)
      setUser(updatedUser)
      toast.success('Profile updated successfully')
    } catch (error: any) {
      const message = error.response?.data?.message || 'Update failed'
      toast.error(message)
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}