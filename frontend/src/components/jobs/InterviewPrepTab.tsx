import { Sparkles } from 'lucide-react'
import type { Job } from '../../types'

interface InterviewPrepTabProps {
  job: Job
  onPrepComplete?: () => void
}

export default function InterviewPrepTab({ 
  job, 
//   onPrepComplete 
}: InterviewPrepTabProps) {
  return (
    <div className="space-y-6">
      {/* Coming Soon Placeholder */}
      <div className="card text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full mb-4">
          <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Interview Prep Coming Soon
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          AI-powered interview preparation tailored to <strong>{job.title}</strong> at <strong>{job.company}</strong> will be available here soon.
        </p>
      </div>

      {/* TODO: Implement Interview Prep functionality */}
      {/* 
        Features to add:
        - Generate interview prep button
        - Behavioral questions with STAR framework
        - Technical questions with key points
        - Questions to ask interviewer
        - Interview tips
        - Common mistakes to avoid
        - Version history
        - Regenerate option
      */}
    </div>
  )
}