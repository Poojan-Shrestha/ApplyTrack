import { useParams, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, Trash2, Edit, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

import { jobsService } from '../services/jobs.service'
import type { Job } from '../types'

import LoadingSpinner from '../components/common/LoadingSpinner'
import JobForm from '../components/jobs/JobForm'
import { getStatusColor } from '../utils/helpers'

export default function JobDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  const fetchJob = useCallback(async (jobId: string) => {
    try {
      setLoading(true)
      const data = await jobsService.getById(jobId)
      setJob(data)
    } catch {
      toast.error('Failed to load job')
      navigate('/jobs')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    if (id) fetchJob(id)
  }, [id, fetchJob])

  const handleDelete = async () => {
    if (!job || !confirm('Are you sure you want to delete this job?')) return
    try {
      await jobsService.delete(job._id)
      toast.success('Job deleted successfully')
      navigate('/jobs')
    } catch {
      toast.error('Failed to delete job')
    }
  }

  const handleUpdate = async (data: Partial<Job>) => {
    if (!job) return
    const updated = await jobsService.update(job._id, data)
    setJob(updated)
    setEditing(false)
  }

  if (loading) return <LoadingSpinner size="lg" />
  if (!job) return <div>Job not found</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/jobs')}
          className="btn btn-ghost flex items-center space-x-2"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Jobs</span>
        </button>
        <div className="flex items-center space-x-2">
          <button onClick={() => setEditing(true)} className="btn btn-secondary">
            <Edit className="h-5 w-5" />
          </button>
          <button onClick={handleDelete} className="btn btn-danger">
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Job Card */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {job.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">{job.company}</p>
          </div>
          <span className={`badge text-lg ${getStatusColor(job.status)}`}>
            {job.status}
          </span>
        </div>

        {job.location && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">{job.location}</p>
        )}
        {job.salaryRange && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Salary: {job.salaryRange}
          </p>
        )}
        {job.jobUrl && (
          <a
            href={job.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 flex items-center space-x-2 mb-6"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Job Posting</span>
          </a>
        )}

        {job.description && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {job.description}
            </p>
          </div>
        )}

        {job.notes && (
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Notes</h2>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
              {job.notes}
            </p>
          </div>
        )}

        {job.atsScore && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">ATS Analysis</h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <p className="text-4xl font-bold text-primary-600 mb-4">{job.atsScore}%</p>
              {job.atsAnalysis && (
                <div className="space-y-4">
                  {job.atsAnalysis.strengths && (
                    <div>
                      <h3 className="font-medium mb-2">Strengths</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {job.atsAnalysis.strengths.map((strength, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {job.atsAnalysis.suggestions && (
                    <div>
                      <h3 className="font-medium mb-2">Suggestions</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {job.atsAnalysis.suggestions.map((suggestion, i) => (
                          <li key={i} className="text-sm text-gray-600 dark:text-gray-400">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editing && <JobForm job={job} onSubmit={handleUpdate} onCancel={() => setEditing(false)} />}
    </div>
  )
}