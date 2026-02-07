import { useEffect, useState } from 'react'
import { dashboardService } from '../services/dashboard.service'
import type { DashboardStats } from '../types'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { Briefcase, FileText, TrendingUp, Clock } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const data = await dashboardService.getStats()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" />
  if (!stats) return <div>Failed to load dashboard</div>

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'text-primary-600',
    },
    {
      title: 'Resumes',
      value: stats.totalResumes,
      icon: FileText,
      color: 'text-green-600',
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: TrendingUp,
      color: 'text-yellow-600',
    },
    {
      title: 'Interviewing',
      value: stats.jobsByStatus.interviewing,
      icon: Clock,
      color: 'text-blue-600',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track your job application progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`h-12 w-12 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">Recent Applications</h2>
        {stats.recentApplications.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No applications yet</p>
        ) : (
          <div className="space-y-3">
            {stats.recentApplications.map((job) => (
              <div
                key={job._id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {job.company}
                  </p>
                </div>
                <span className={`badge ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function getStatusColor(status: string) {
  const colors: any = {
    saved: 'bg-gray-200 text-gray-800',
    applied: 'bg-blue-100 text-blue-800',
    interviewing: 'bg-yellow-100 text-yellow-800',
    offered: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-200 text-gray-800'
}