import { useState, useEffect, useRef } from 'react'
import type { Job, JobFilters, JobStatus } from '../types'
import { jobsService } from '../services/jobs.service'
import { debounce } from '../utils/helpers'
import toast from 'react-hot-toast'

export function useJobs(filters?: JobFilters) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const status = filters?.status
  const search = filters?.search

  // Stable debounced function
  const fetchJobsRef = useRef(
    debounce((...args: unknown[]) => {
      const [s, q] = args as [JobStatus | 'all' | undefined, string]

      (async () => {
        try {
          setLoading(true)
          setError(null)
          const data = await jobsService.getAll({ status: s, search: q })
          setJobs(data)
        } catch (err: any) {
          const message = err.response?.data?.message || 'Failed to fetch jobs'
          setError(message)
          toast.error(message)
        } finally {
          setLoading(false)
        }
      })()
    }, 300)
  )

  // Trigger fetch whenever status or search changes
  useEffect(() => {
    fetchJobsRef.current(status, search)
  }, [status, search])

  // Callable fetchJobs to return from hook
  const fetchJobs = (s?: JobStatus | 'all', q?: string) => {
    fetchJobsRef.current(s ?? status, q ?? search)
  }

  const createJob = async (jobData: Partial<Job>) => {
    try {
      const newJob = await jobsService.create(jobData)
      setJobs((prev) => [newJob, ...prev])
      toast.success('Job created successfully')
      return newJob
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to create job'
      toast.error(message)
      throw err
    }
  }

  const updateJob = async (id: string, jobData: Partial<Job>) => {
    try {
      const updated = await jobsService.update(id, jobData)
      setJobs((prev) => prev.map((job) => (job._id === id ? updated : job)))
      toast.success('Job updated successfully')
      return updated
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update job'
      toast.error(message)
      throw err
    }
  }

  const deleteJob = async (id: string) => {
    try {
      await jobsService.delete(id)
      setJobs((prev) => prev.filter((job) => job._id !== id))
      toast.success('Job deleted successfully')
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to delete job'
      toast.error(message)
      throw err
    }
  }

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    createJob,
    updateJob,
    deleteJob,
  }
}