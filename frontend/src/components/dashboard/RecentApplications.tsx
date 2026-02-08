import type { Job } from '../../types'
import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatters'
import { getScoreColor } from '../../utils/helpers'
import StatusBadge from '../jobs/StatusBadge'
import { Briefcase, ArrowRight } from 'lucide-react'

interface RecentApplicationsProps {
  jobs: Job[]
}

export default function RecentApplications({ jobs }: RecentApplicationsProps) {
  if (jobs.length === 0) {
    return (
      <div className="card text-center py-12">
        <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">
          No applications yet. Start by adding a job!
        </p>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Recent Applications
        </h2>
        <Link
          to="/jobs"
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center space-x-1"
        >
          <span>View all</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <Link
            key={job._id}
            to={`/jobs/${job._id}`}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {job.company}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {formatDate(job.appliedDate || job.createdAt)}
              </p>
            </div>
            <div className="ml-4 flex items-center space-x-3">
              {job.atsScore && job.atsScore > 0 && (
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">ATS Score</p>
                  <p className={`font-bold ${getScoreColor(job.atsScore)}`}>
                    {job.atsScore}%
                  </p>
                </div>
              )}
              <StatusBadge status={job.status} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}