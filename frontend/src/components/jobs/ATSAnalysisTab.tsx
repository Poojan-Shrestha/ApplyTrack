import { useState } from 'react'
import {
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2,
  BarChart3,
  FileText,
} from 'lucide-react'
import toast from 'react-hot-toast'

import type { Job, Resume } from '../../types'
import { jobsService } from '../../services/jobs.service'
import { getScoreColor } from '../../utils/helpers'
import ATSScoreCircle from './ATSScoreCircle'

interface ATSAnalysisTabProps {
  job: Job
  resumes: Resume[]
  onAnalysisComplete: () => void
}

export default function ATSAnalysisTab({ 
  job, 
  resumes, 
  onAnalysisComplete 
}: ATSAnalysisTabProps) {
  const [analyzing, setAnalyzing] = useState(false)
  const [selectedResume, setSelectedResume] = useState(
    resumes.find(r => r.isDefault)?._id || resumes[0]?._id || ''
  )

  const analyzedResume = resumes.find(r => r._id === job.atsAnalyzedResumeId)

  const handleAnalyze = async () => {
    if (!selectedResume) {
      toast.error('Please select a resume')
      return
    }

    setAnalyzing(true)
    try {
      await jobsService.analyzeATS(job._id, selectedResume)
      onAnalysisComplete()
      toast.success('ATS analysis complete!')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Analyze Section - Always Visible */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary-600" />
            <span>ATS Analysis</span>
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <label 
              htmlFor="resume-select"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Select Resume to Analyze
            </label>
            <select
              id="resume-select"
              value={selectedResume}
              onChange={(e) => setSelectedResume(e.target.value)}
              className="input w-full"
              disabled={analyzing || resumes.length === 0}
            >
              <option value="">Choose a resume...</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.originalFilename}
                  {resume.isDefault && ' (Default)'}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={analyzing || !selectedResume || resumes.length === 0}
            className="w-full btn btn-primary flex items-center justify-center space-x-2"
          >
            {analyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing Resume...</span>
              </>
            ) : (
              <>
                <TrendingUp className="h-5 w-5" />
                <span>{job.atsScore ? 'Re-analyze Resume' : 'Run ATS Analysis'}</span>
              </>
            )}
          </button>

          {resumes.length === 0 && (
            <p className="text-sm text-yellow-600 dark:text-yellow-400 text-center">
              Upload a resume first to run ATS analysis
            </p>
          )}
        </div>
      </div>

      {/* Results Section */}
      {job.atsScore && job.atsAnalysis ? (
        <>
          {/* Score Overview */}
          <div className="card">
            <div className="flex flex-col items-center space-y-6 py-6">
              <ATSScoreCircle score={job.atsScore} size={200} />
              
              {analyzedResume && (
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Analyzed with
                  </p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {analyzedResume.originalFilename}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sub-scores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Keyword Match
                </p>
                <BarChart3 className="h-5 w-5 text-primary-600" />
              </div>
              <p className={`text-3xl font-bold ${getScoreColor(job.atsAnalysis.keywordMatch)}`}>
                {job.atsAnalysis.keywordMatch}%
              </p>
              <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${job.atsAnalysis.keywordMatch}%` }}
                />
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Formatting Score
                </p>
                <FileText className="h-5 w-5 text-primary-600" />
              </div>
              <p className={`text-3xl font-bold ${getScoreColor(job.atsAnalysis.formattingScore)}`}>
                {job.atsAnalysis.formattingScore}%
              </p>
              <div className="mt-3 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${job.atsAnalysis.formattingScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Matched Keywords */}
          {job.atsAnalysis.matchedKeywords && job.atsAnalysis.matchedKeywords.length > 0 && (
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Matched Keywords ({job.atsAnalysis.matchedKeywords.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.atsAnalysis.matchedKeywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm rounded-full font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {job.atsAnalysis.missingKeywords && job.atsAnalysis.missingKeywords.length > 0 && (
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Missing Keywords ({job.atsAnalysis.missingKeywords.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {job.atsAnalysis.missingKeywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm rounded-full font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {job.atsAnalysis.strengths && job.atsAnalysis.strengths.length > 0 && (
            <div className="card bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span>Strengths</span>
              </h3>
              <ul className="space-y-3">
                {job.atsAnalysis.strengths.map((strength, i) => (
                  <li
                    key={i}
                    className="flex items-start space-x-3 text-green-800 dark:text-green-200"
                  >
                    <span className="text-green-600 dark:text-green-400 font-bold mt-0.5">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {job.atsAnalysis.suggestions && job.atsAnalysis.suggestions.length > 0 && (
            <div className="card bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span>Suggestions for Improvement</span>
              </h3>
              <ul className="space-y-3">
                {job.atsAnalysis.suggestions.map((suggestion, i) => (
                  <li
                    key={i}
                    className="flex items-start space-x-3 text-blue-800 dark:text-blue-200"
                  >
                    <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">→</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="card text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
            <Target className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Analysis Yet
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Run ATS analysis to see how well your resume matches this job description.
          </p>
        </div>
      )}
    </div>
  )
}