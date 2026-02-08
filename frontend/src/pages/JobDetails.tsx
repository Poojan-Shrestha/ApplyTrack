import { useParams, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, Trash2, Edit, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'

import { jobsService } from '../services/jobs.service'
import { resumesService } from '../services/resumes.service'
import type { Job, Resume, ATSAnalysis } from '../types'

import LoadingSpinner from '../components/common/LoadingSpinner'
import JobForm from '../components/jobs/JobForm'
import ATSScoreCircle from '../components/jobs/ATSScoreCircle'
import { getStatusColor } from '../utils/helpers'

export default function JobDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)

  // Resumes & ATS state
  const [resumes, setResumes] = useState<Resume[]>([])
  const [resumesLoading, setResumesLoading] = useState(true)
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null)
  const [atsAnalyzing, setAtsAnalyzing] = useState(false)
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null)

  // Fetch job details
  const fetchJob = useCallback(async (jobId: string) => {
    try {
      setLoading(true)
      const data = await jobsService.getById(jobId)
      setJob(data)
      if (data.atsAnalysis) setAtsAnalysis(data.atsAnalysis)
    } catch {
      toast.error('Failed to load job')
      navigate('/jobs')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  // Fetch resumes
  const fetchResumes = useCallback(async () => {
    try {
      setResumesLoading(true)
      const data = await resumesService.getAll()
      setResumes(data)
      // pick default resume if exists
      if (data.length > 0) {
        const defaultResume = data.find(r => r.isDefault) || data[0]
        setSelectedResume(defaultResume)
      }
    } catch {
      toast.error('Failed to load resumes')
    } finally {
      setResumesLoading(false)
    }
  }, [])

  useEffect(() => {
    if (id) fetchJob(id)
    fetchResumes()
  }, [id, fetchJob, fetchResumes])

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

  const handleRunATS = async () => {
    if (!job || !selectedResume) return
    setAtsAnalyzing(true)
    try {
      const result = await jobsService.analyzeATS(job._id, selectedResume._id)
      setAtsAnalysis(result)
      setJob(prev => prev ? { ...prev, atsAnalysis: result, atsScore: result.overallScore } : prev)
      toast.success('ATS analysis complete!')
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.message || 'ATS analysis failed')
    } finally {
      setAtsAnalyzing(false)
    }
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
      <div className="card space-y-4">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">{job.company}</p>
          </div>
          <span className={`badge text-lg ${getStatusColor(job.status)}`}>{job.status}</span>
        </div>

        {job.location && <p className="text-gray-600 dark:text-gray-400 mb-2">{job.location}</p>}
        {job.salaryRange && <p className="text-gray-600 dark:text-gray-400 mb-2">Salary: {job.salaryRange}</p>}
        {job.jobUrl && (
          <a
            href={job.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 flex items-center space-x-2"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View Job Posting</span>
          </a>
        )}

        {job.description && (
          <div>
            <h2 className="text-xl font-bold mb-2">Description</h2>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{job.description}</p>
          </div>
        )}

        {job.notes && (
          <div>
            <h2 className="text-xl font-bold mb-2">Notes</h2>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{job.notes}</p>
          </div>
        )}

        {/* ATS Analysis Section */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">ATS Analysis</h2>

          {atsAnalysis ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <ATSScoreCircle score={atsAnalysis.overallScore} size={80} />
                {selectedResume && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Resume used: {selectedResume.originalFilename}
                  </p>
                )}
              </div>

              {atsAnalysis.strengths?.length > 0 && (
                <div>
                  <h3 className="font-medium mb-1">Strengths</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                    {atsAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}

              {atsAnalysis.suggestions?.length > 0 && (
                <div>
                  <h3 className="font-medium mb-1">Suggestions</h3>
                  <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400">
                    {atsAnalysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p>No ATS analysis run yet.</p>
          )}

          {/* Resume selection & rerun button */}
          <div className="mt-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Resume</label>
            <select
              value={selectedResume?._id || ''}
              onChange={(e) => setSelectedResume(resumes.find(r => r._id === e.target.value) || null)}
              className="input w-full"
              disabled={resumesLoading || resumes.length === 0}
            >
              {resumes.map(r => (
                <option key={r._id} value={r._id}>{r.originalFilename}</option>
              ))}
            </select>
            <button
              onClick={handleRunATS}
              className="btn btn-primary w-full mt-2"
              disabled={!selectedResume || atsAnalyzing}
            >
              {atsAnalyzing ? 'Analyzing...' : 'Run ATS Analysis'}
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && <JobForm job={job} onSubmit={handleUpdate} onCancel={() => setEditing(false)} />}
    </div>
  )
}