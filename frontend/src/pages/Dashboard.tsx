import { useEffect, useState } from 'react'
import { dashboardService } from '../services/dashboard.service'
import type { DashboardStats } from '../types'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { Briefcase, FileText, TrendingUp, Clock } from 'lucide-react'
import StatsCard from '../components/dashboard/StatsCard'
import RecentApplications from '../components/dashboard/RecentApplications'

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

  // Prepare stats cards data
  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'bg-primary-600',
    },
    {
      title: 'Resumes',
      value: stats.totalResumes,
      icon: FileText,
      color: 'bg-green-600',
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: TrendingUp,
      color: 'bg-yellow-600',
    },
    {
      title: 'Interviewing',
      value: stats.jobsByStatus.interviewing,
      icon: Clock,
      color: 'bg-blue-600',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Track your job application progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Recent Applications */}
      <RecentApplications jobs={stats.recentApplications} />
    </div>
  )
}