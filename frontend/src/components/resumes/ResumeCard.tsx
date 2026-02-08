import { useState } from 'react'
import type { Resume } from '../../types'
import { FileText, Trash2, Download, Star, BarChart } from 'lucide-react'
import { formatFileSize } from '../../utils/helpers'
import { formatDate } from '../../utils/formatters'

interface ResumeCardProps {
  resume: Resume
  onDelete: (id: string) => Promise<void>
  onSetDefault: (id: string) => Promise<void>
  onAnalyze?: (id: string) => Promise<void>
}

export default function ResumeCard({ resume, onDelete, onSetDefault, onAnalyze }: ResumeCardProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await onDelete(resume._id)
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefault = async () => {
    setLoading(true)
    try {
      await onSetDefault(resume._id)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!onAnalyze) return
    setLoading(true)
    try {
      await onAnalyze(resume._id)
    } finally {
      setLoading(false)
    }
  }

  // Always show Analyze button if the handler exists
  const showAnalyzeButton = !!onAnalyze
  const structureScore = resume.analysis?.structureScore ?? 0

  return (
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
              {formatFileSize(resume.fileSize)}
            </p>
          </div>
        </div>
        {resume.isDefault && (
          <span title="Default Resume">
            <Star className="h-5 w-5 text-yellow-500 fill-current flex-shrink-0" />
          </span>
        )}
      </div>

      {/* Analysis Score */}
      {resume.analysis && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Structure</span>
            <span className="font-bold text-gray-900 dark:text-white">
              {structureScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all ease-out"
              style={{ width: `${structureScore}%` }}
            />
          </div>
        </div>
      )}

      {/* Metadata */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Uploaded {formatDate(resume.createdAt)}
      </p>

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
          className="btn btn-secondary text-sm flex items-center justify-center"
          title="Download"
        >
          <Download className="h-4 w-4" />
        </a>

        {showAnalyzeButton && (
          <button
            onClick={handleAnalyze}
            className="btn btn-secondary text-sm flex items-center justify-center"
            title="Analyze Quality"
            disabled={loading}
          >
            <BarChart className="h-4 w-4" />
          </button>
        )}

        <button
          onClick={handleDelete}
          className="btn btn-danger text-sm flex items-center justify-center"
          title="Delete"
          disabled={loading}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}