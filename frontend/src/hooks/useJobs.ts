import { useEffect, useMemo, useState, useCallback } from 'react'
import type { Job, JobFilters, JobStatus } from '../types'
import { jobsService } from '../services/jobs.service'
import toast from 'react-hot-toast'

export function useJobs(filters?: JobFilters) {
  const [allJobs, setAllJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const status = filters?.status
  const search = filters?.search?.toLowerCase().trim()

  const fetchJobs = useCallback(
    async (s?: JobStatus | 'all') => {
      try {
        setLoading(true)
        setError(null)

        const data = await jobsService.getAll({
          status: s ?? status,
        })

        setAllJobs(data)
      } catch (err: any) {
        const message =
          err.response?.data?.message || 'Failed to fetch jobs'
        setError(message)
        toast.error(message)
      } finally {
        setLoading(false)
      }
    },
    [status]
  )

  useEffect(() => {
    fetchJobs(status)
  }, [status, fetchJobs])

  const jobs = useMemo(() => {
    if (!search) return allJobs

    return allJobs.filter((job) =>
      job.title.toLowerCase().includes(search) ||
      job.company.toLowerCase().includes(search) ||
      job.location?.toLowerCase().includes(search)
    )
  }, [allJobs, search])

  const createJob = async (jobData: Partial<Job>) => {
    try {
      const newJob = await jobsService.create(jobData)
      setAllJobs((prev) => [newJob, ...prev])
      toast.success('Job created successfully')
      return newJob
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to create job'
      toast.error(message)
      throw err
    }
  }

  const updateJob = async (id: string, jobData: Partial<Job>) => {
    try {
      const updated = await jobsService.update(id, jobData)
      setAllJobs((prev) =>
        prev.map((job) => (job._id === id ? updated : job))
      )
      toast.success('Job updated successfully')
      return updated
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to update job'
      toast.error(message)
      throw err
    }
  }

  const deleteJob = async (id: string) => {
    try {
      await jobsService.delete(id)
      setAllJobs((prev) => prev.filter((job) => job._id !== id))
      toast.success('Job deleted successfully')
    } catch (err: any) {
      const message =
        err.response?.data?.message || 'Failed to delete job'
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