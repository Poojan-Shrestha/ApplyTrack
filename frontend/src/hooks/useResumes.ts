import { useState, useEffect } from 'react'
import type { Resume } from '../types'
import { resumesService } from '../services/resumes.service'
import toast from 'react-hot-toast'

export function useResumes() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  const fetchResumes = async () => {
    try {
      setLoading(true)
      const data = await resumesService.getAll()
      setResumes(data)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to fetch resumes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  const uploadResume = async (file: File) => {
    try {
      setUploading(true)
      const newResume = await resumesService.upload(file)
      setResumes((prev) => [newResume, ...prev])
      toast.success('Resume uploaded successfully')
      return newResume
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload resume')
      throw err
    } finally {
      setUploading(false)
    }
  }

  const deleteResume = async (id: string) => {
    try {
      await resumesService.delete(id)
      setResumes((prev) => prev.filter((r) => r._id !== id))
      toast.success('Resume deleted successfully')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete resume')
      throw err
    }
  }

  const setDefault = async (id: string) => {
    try {
      const updated = await resumesService.setDefault(id)
      setResumes((prev) =>
        prev.map((r) => ({
          ...r,
          isDefault: r._id === id,
        }))
      )
      toast.success('Default resume updated')
      return updated
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to set default resume')
      throw err
    }
  }

  const analyzeResume = async (id: string) => {
    try {
      const analysis = await resumesService.analyze(id)
      setResumes((prev) =>
        prev.map((r) => (r._id === id ? { ...r, analysis } : r))
      )
      toast.success('Resume analysis complete')
      return analysis
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to analyze resume')
      throw err
    }
  }

  return {
    resumes,
    loading,
    uploading,
    uploadResume,
    deleteResume,
    setDefault,
    analyzeResume,
    refetch: fetchResumes,
  }
}