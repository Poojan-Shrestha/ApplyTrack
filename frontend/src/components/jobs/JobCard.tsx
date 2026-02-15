import type { Job } from '../../types'
import { MapPin, ExternalLink, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate, formatCurrency } from '../../utils/formatters'
import StatusBadge from './StatusBadge'
import { getScoreColor } from '../../utils/helpers'

interface JobCardProps {
  job: Job
}

export default function JobCard({ job }: JobCardProps) {
  const detectedCurrency: 'USD' | 'INR' =
    job?.salaryRange?.includes('₹') ? 'INR' : 'USD'

  return (
    <Link
      to={`/jobs/${job._id}`}
      className="card hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg group-hover:text-primary-600">
            {job.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            {job.company}
          </p>
        </div>
        <StatusBadge status={job.status} />
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4">
        {job.location && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4 mr-2" />
            {job.location}
          </div>
        )}

        {job.salaryRange && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            {formatCurrency(job.salaryRange, detectedCurrency)}
          </div>
        )}

        {job.jobUrl && (
          <div className="flex items-center text-sm text-primary-600">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Posting
          </div>
        )}
      </div>

      {/* ATS Score */}
      {job.atsScore !== undefined && job.atsScore > 0 && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between">
            <span className="text-sm">ATS Score</span>
            <div className="flex items-center gap-2">
              <TrendingUp className={`h-4 w-4 ${getScoreColor(job.atsScore)}`} />
              <span className={`font-bold ${getScoreColor(job.atsScore)}`}>
                {job.atsScore}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {job.appliedDate
            ? `Applied ${formatDate(job.appliedDate)}`
            : `Created ${formatDate(job.createdAt)}`}
        </p>
      </div>
    </Link>
  )
}