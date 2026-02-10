import client from "../api/client"
import type { ApiResponse, Job, JobFilters, ATSAnalysis } from "../types"

export const jobsService = {
  async getAll(filters?: JobFilters): Promise<Job[]> {
    const params = new URLSearchParams()
    if (filters?.status && filters.status !== 'all') params.append('status', filters.status)

    const { data } = await client.get<ApiResponse<Job[]>>(`/jobs?${params.toString()}`)
    return data.data ?? []
  },

  async getById(id: string): Promise<Job> {
    const { data } = await client.get<ApiResponse<Job>>(`/jobs/${id}`)
    return data.data!
  },

  async create(jobData: Partial<Job>): Promise<Job> {
    const { data } = await client.post<ApiResponse<Job>>('/jobs', jobData)
    return data.data!
  },

  async update(id: string, jobData: Partial<Job>): Promise<Job> {
    const { data } = await client.patch<ApiResponse<Job>>(`/jobs/${id}`, jobData)
    return data.data!
  },

  async delete(id: string): Promise<void> {
    await client.delete(`/jobs/${id}`)
  },

  async analyzeATS(jobId: string, resumeId: string): Promise<ATSAnalysis> {
    const { data } = await client.post<ApiResponse<ATSAnalysis>>(
      `/jobs/${jobId}/ats-analysis`,
      { resumeId }
    )
    return data.data!
  },
}