import { useParams, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import {
  ArrowLeft,
  Trash2,
  Edit,
  Building2,
  FileText,
} from 'lucide-react'
import toast from 'react-hot-toast'

import type { Job } from '../types'
import { jobsService } from '../services/jobs.service'
import { useResumes } from '../hooks/useResumes'

import Tabs from '../components/common/Tabs'
import JobForm from '../components/jobs/JobForm'
import StatusBadge from '../components/jobs/StatusBadge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ATSAnalysisTab from '../components/jobs/ATSAnalysisTab'
import InterviewPrepTab from '../components/jobs/InterviewPrepTab'

type TabId = 'details' | 'ats' | 'interview'

export default function JobDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('details')
  const [showEditForm, setShowEditForm] = useState(false)

  const { resumes } = useResumes()

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
    if (!job || !confirm('Are you sure you want to delete this job? This will also delete all associated interview prep versions.')) return
    
    try {
      await jobsService.delete(job._id)
      toast.success('Job deleted successfully')
      navigate('/jobs')
    } catch {
      toast.error('Failed to delete job')
    }
  }

  const handleUpdate = async (jobData: Partial<Job>) => {
    if (!job) return
    try {
      const updated = await jobsService.update(job._id, jobData)
      setJob(updated)
      setShowEditForm(false)
      toast.success('Job updated successfully')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update job')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="card text-center py-16">
        <p className="text-gray-600 dark:text-gray-400">Job not found</p>
      </div>
    )
  }

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
          <button
            onClick={() => setShowEditForm(true)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-danger flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Job Header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {job.title}
            </h1>
            <div className="flex items-center space-x-2 text-xl text-gray-600 dark:text-gray-400">
              <Building2 className="h-5 w-5" />
              <span>{job.company}</span>
            </div>
          </div>
          <StatusBadge status={job.status} />
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as TabId)}
        tabs={[
          { id: 'details', label: 'Details' },
          { 
            id: 'ats', 
            label: 'ATS Analysis',
            badge: job.atsScore ? `${job.atsScore}%` : undefined 
          },
          { id: 'interview', label: 'Interview Prep' },
        ]}
      />

      {/* DETAILS TAB */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          {/* Job Metadata */}
          {(job.location || job.salaryRange || job.appliedDate || job.jobUrl) && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Job Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.location && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="text-gray-900 dark:text-white font-medium">{job.location}</p>
                  </div>
                )}
                {job.salaryRange && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Salary Range</p>
                    <p className="text-gray-900 dark:text-white font-medium">{job.salaryRange}</p>
                  </div>
                )}
                {job.appliedDate && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Applied Date</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {new Date(job.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {job.jobUrl && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Job URL</p>
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                    >
                      View Posting →
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {job.description && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Job Description</span>
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Requirements
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {job.requirements}
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          {job.notes && (
            <div className="card">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Personal Notes
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {job.notes}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ATS ANALYSIS TAB */}
      {activeTab === 'ats' && (
        <ATSAnalysisTab
          job={job}
          resumes={resumes}
          onAnalysisComplete={() => fetchJob(job._id)}
        />
      )}

      {/* INTERVIEW PREP TAB */}
      {activeTab === 'interview' && (
        <InterviewPrepTab
          job={job}
          onPrepComplete={() => fetchJob(job._id)}
        />
      )}

      {/* Edit Modal */}
      {showEditForm && (
        <JobForm
          job={job}
          onSubmit={handleUpdate}
          onCancel={() => setShowEditForm(false)}
        />
      )}
    </div>
  )
}