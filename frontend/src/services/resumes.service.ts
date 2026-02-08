import client from "../api/client"
import type { ApiResponse, Resume, ResumeAnalysis } from "../types"

export const resumesService = {
  async getAll(): Promise<Resume[]> {
    const { data } = await client.get<ApiResponse<Resume[]>>('/resumes')
    return data.data ?? []
  },

  async upload(file: File): Promise<Resume> {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await client.post<ApiResponse<Resume>>('/resumes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data.data!
  },

  async delete(id: string): Promise<void> {
    await client.delete(`/resumes/${id}`)
  },

  async analyze(id: string): Promise<ResumeAnalysis> {
    const { data } = await client.post<ApiResponse<ResumeAnalysis>>(`/resumes/${id}/analyze`)
    return data.data!
  },

  async setDefault(id: string): Promise<Resume> {
    const { data} = await client.patch<ApiResponse<Resume>>(`/resumes/${id}/default`)
    return data.data!
  },
}