import type { Resume } from '../../types'
import ResumeCard from './ResumeCard'
import { FileX } from 'lucide-react'

interface ResumeListProps {
  resumes: Resume[]
  onDelete: (id: string) => Promise<void>
  onSetDefault: (id: string) => Promise<void>
  onAnalyze?: (id: string) => Promise<void>
}

export default function ResumeList({ resumes, onDelete, onSetDefault, onAnalyze }: ResumeListProps) {
  if (resumes.length === 0) {
    return (
      <div className="card text-center py-12">
        <FileX className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Resumes Yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Upload your first resume to get started with ATS analysis
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resumes.map((resume) => (
        <ResumeCard
          key={resume._id}
          resume={resume}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
          onAnalyze={onAnalyze}
        />
      ))}
    </div>
  )
}