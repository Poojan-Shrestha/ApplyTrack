import { useState } from 'react'
import { Plus } from 'lucide-react'

import { useJobs } from '../hooks/useJobs'
import type { JobStatus, Job } from '../types'

import LoadingSpinner from '../components/common/LoadingSpinner'
import JobCard from '../components/jobs/JobCard'
import JobFilters from '../components/jobs/JobFilters'
import JobForm from '../components/jobs/JobForm'

export default function JobsApplied() {
  const [status, setStatus] = useState<JobStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [creating, setCreating] = useState(false)

  const { jobs, loading, createJob } = useJobs({ status, search })

  const handleCreate = async (data: Partial<Job>) => {
    await createJob(data)
    setCreating(false)
  }

  if (loading) return <LoadingSpinner size="lg" />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Jobs
        </h1>

        <button
          onClick={() => setCreating(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Job</span>
        </button>
      </div>

      {/* Create Modal */}
      {creating && (
        <JobForm
          onSubmit={handleCreate}
          onCancel={() => setCreating(false)}
        />
      )}

      {/* Filters */}
      <JobFilters
        status={status}
        search={search}
        onStatusChange={setStatus}
        onSearchChange={setSearch}
      />

      {/* Jobs Grid */}
      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No jobs found. Add your first job application!
          </p>
        </div>
      )}
    </div>
  )
}