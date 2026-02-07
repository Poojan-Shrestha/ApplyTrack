import type { JobStatus } from '../../types'
import { Search, Filter } from 'lucide-react'

interface JobFiltersProps {
  status: JobStatus | 'all'
  search: string
  onStatusChange: (status: JobStatus | 'all') => void
  onSearchChange: (search: string) => void
}

export default function JobFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
}: JobFiltersProps) {
  return (
    <div className="card">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs, companies..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as JobStatus | 'all')}
            className="input pl-10 w-full md:w-48"
          >
            <option value="all">All Status</option>
            <option value="saved">Saved</option>
            <option value="applied">Applied</option>
            <option value="interviewing">Interviewing</option>
            <option value="offered">Offered</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {(status !== 'all' || search) && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            {status !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                {status}
                <button
                  onClick={() => onStatusChange('all')}
                  className="ml-2 hover:text-primary-600"
                >
                  ×
                </button>
              </span>
            )}
            {search && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                "{search}"
                <button
                  onClick={() => onSearchChange('')}
                  className="ml-2 hover:text-gray-600"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}