import client from "../api/client"
import type { ApiResponse, DashboardStats } from "../types"

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await client.get<ApiResponse<DashboardStats>>('/dashboard/stats')
    return data.data!
  },
}