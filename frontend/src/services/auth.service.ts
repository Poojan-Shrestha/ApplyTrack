import client from '../api/client'
import type { ApiResponse, User } from '../types'

export const authService = {
  async register(email: string, password: string, fullName: string): Promise<User> {
    const { data } = await client.post<ApiResponse<User>>('/auth/register', {
      email,
      password,
      fullName,
    })
    return data.data!
  },

  async login(email: string, password: string): Promise<User> {
    const { data } = await client.post<ApiResponse<User>>('/auth/login', {
      email,
      password,
    })
    return data.data!
  },

  async logout(): Promise<void> {
    await client.post('/auth/logout')
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await client.get<ApiResponse<User>>('/auth/me')
    return data.data!
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const { data } = await client.patch<ApiResponse<User>>('/auth/profile', updates)
    return data.data!
  },
}