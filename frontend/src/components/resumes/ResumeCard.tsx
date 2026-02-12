import { useState } from 'react'
import type { Resume } from '../../types'
import { FileText, Trash2, Download, Star, BarChart, X, CheckCircle, AlertCircle } from 'lucide-react'
import { formatFileSize } from '../../utils/helpers'
import { formatDate } from '../../utils/formatters'
import toast from 'react-hot-toast'

interface ResumeCardProps {
  resume: Resume
  onDelete: (id: string) => Promise<void>
  onSetDefault: (id: string) => Promise<void>
  onAnalyze?: (id: string) => Promise<void>
}

export default function ResumeCard({ resume, onDelete, onSetDefault, onAnalyze }: ResumeCardProps) {
  const [loading, setLoading] = useState(false)
  const [showAnalysisModal, setShowAnalysisModal] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this resume?')) return
    
    setLoading(true)
    try {
      await onDelete(resume._id)
      toast.success('Resume deleted')
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefault = async () => {
    setLoading(true)
    try {
      await onSetDefault(resume._id)
      toast.success('Default resume updated')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!onAnalyze) return
    setLoading(true)
    try {
      await onAnalyze(resume._id)
      toast.success('Resume analysis complete!')
    } catch (error: any) {
      toast.error(error.message || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 dark:text-green-400'
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400'
    if (score >= 50) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-600'
    if (score >= 70) return 'bg-yellow-600'
    if (score >= 50) return 'bg-orange-600'
    return 'bg-red-600'
  }

  // Check if analysis actually has data
  const hasAnalysis = resume.analysis && 
    (resume.analysis.structureScore > 0 || resume.analysis.contentScore > 0)

  const structureScore = resume.analysis?.structureScore ?? 0
  const contentScore = resume.analysis?.contentScore ?? 0
  const overallScore = hasAnalysis ? Math.round((structureScore + contentScore) / 2) : 0

  return (
    <>
      <div className="card hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
              <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">
                {resume.originalFilename}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatFileSize(resume.fileSize)} • {formatDate(resume.createdAt)}
              </p>
            </div>
          </div>
          {resume.isDefault && (
            <span title="Default Resume">
              <Star className="h-5 w-5 text-yellow-500 fill-current flex-shrink-0" />
            </span>
          )}
        </div>

        {/* Analysis Score - Only show if actually analyzed */}
        {hasAnalysis ? (
          <div className="mb-4">
            <div className="p-4 bg-gradient-to-br from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg border border-primary-100 dark:border-primary-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Resume Quality
                </span>
                <span className={`text-2xl font-bold ${getScoreColor(overallScore)}`}>
                  {overallScore}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                <div
                  className={`${getScoreBg(overallScore)} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${overallScore}%` }}
                />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Structure: </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {structureScore}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Content: </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {contentScore}%
                  </span>
                </div>
              </div>

              {/* Missing Sections Alert */}
              {resume.analysis?.missingSections && resume.analysis.missingSections.length > 0 && (
                <div className="flex items-start space-x-2 text-xs text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 rounded px-2 py-1.5">
                  <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span>Missing: {resume.analysis.missingSections.join(', ')}</span>
                </div>
              )}

              <button
                onClick={() => setShowAnalysisModal(true)}
                className="w-full mt-3 text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                View Full Analysis →
              </button>
            </div>
          </div>
        ) : (
          // Show "Not analyzed" state
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Not analyzed yet
            </p>
            <button
              onClick={handleAnalyze}
              disabled={loading || !onAnalyze}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Resume Quality →'}
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {!resume.isDefault && (
            <button
              onClick={handleSetDefault}
              className="btn btn-secondary text-sm flex-1"
              disabled={loading}
            >
              Set Default
            </button>
          )}

          <a
            href={resume.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary text-sm flex items-center justify-center px-3"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </a>

          {/* Only show re-analyze if already analyzed */}
          {onAnalyze && hasAnalysis && (
            <button
              onClick={handleAnalyze}
              className="btn btn-secondary text-sm flex items-center justify-center px-3"
              title="Re-analyze Quality"
              disabled={loading}
            >
              <BarChart className="h-4 w-4" />
            </button>
          )}

          <button
            onClick={handleDelete}
            className="btn btn-danger text-sm flex items-center justify-center px-3"
            title="Delete"
            disabled={loading}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Analysis Modal - Only show if has analysis */}
      {showAnalysisModal && hasAnalysis && resume.analysis && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 rounded-t-xl flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Resume Quality Analysis
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {resume.originalFilename}
                </p>
              </div>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Overall Score */}
              <div className="text-center py-6">
                <div className={`text-6xl font-bold ${getScoreColor(overallScore)} mb-2`}>
                  {overallScore}%
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Overall Quality Score
                </p>
              </div>

              {/* Sub-Scores */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Structure</span>
                    <span className={`text-2xl font-bold ${getScoreColor(structureScore)}`}>
                      {structureScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`${getScoreBg(structureScore)} h-2 rounded-full transition-all`}
                      style={{ width: `${structureScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Content</span>
                    <span className={`text-2xl font-bold ${getScoreColor(contentScore)}`}>
                      {contentScore}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className={`${getScoreBg(contentScore)} h-2 rounded-full transition-all`}
                      style={{ width: `${contentScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Missing Sections */}
              {resume.analysis?.missingSections && resume.analysis.missingSections.length > 0 && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                      Missing Sections
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resume.analysis.missingSections.map((section, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-sm rounded-full"
                      >
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {resume.analysis?.suggestions && resume.analysis.suggestions.length > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                      Suggestions for Improvement
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {resume.analysis.suggestions.map((suggestion, i) => (
                      <li
                        key={i}
                        className="flex items-start space-x-2 text-sm text-blue-800 dark:text-blue-200"
                      >
                        <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">→</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Analyzed Date */}
              {resume.analysis?.analyzedAt && (
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Analyzed on {formatDate(resume.analysis.analyzedAt)}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAnalysisModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowAnalysisModal(false)
                    handleAnalyze()
                  }}
                  className="btn btn-primary flex-1"
                  disabled={loading}
                >
                  Re-analyze
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}