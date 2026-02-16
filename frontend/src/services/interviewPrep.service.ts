import client from "../api/client"

export const interviewPrepService = {
  // Generate or get cached interview prep
  generate: async (jobId: string, regenerate: boolean = false): Promise<any> => {
    const response = await client.post('/interview-prep', { jobId, regenerate })
    return response.data
  },

  // Get single interview prep by ID
  getById: async (prepId: string): Promise<any> => {
    const response = await client.get(`/interview-prep/${prepId}`)
    return response.data.data
  },

  // Get version history for a job
  getHistory: async (jobId: string): Promise<any[]> => {
    const response = await client.get(`/interview-prep/history/${jobId}`)
    return response.data.data
  },

  // Restore an old version (make it active)
  restore: async (prepId: string): Promise<any> => {
    const response = await client.patch(`/interview-prep/${prepId}/restore`)
    return response.data.data
  },

  // Delete a version
  delete: async (prepId: string): Promise<void> => {
    await client.delete(`/interview-prep/${prepId}`)
  },
}