import { Circle } from 'lucide-react'
import type { JobStatus } from '../../types'
import { getStatusColor } from '../../utils/helpers'

interface StatusBadgeProps {
  status: JobStatus
  showDot?: boolean
}

export default function StatusBadge({ status, showDot = true }: StatusBadgeProps) {
  const getIcon = () => {
    switch (status) {
      case 'saved':
        return showDot ? <Circle className="h-2 w-2 fill-current" /> : null
      case 'applied':
        return showDot ? <Circle className="h-2 w-2 fill-current" /> : null
      case 'interviewing':
        return showDot ? <Circle className="h-2 w-2 fill-current animate-pulse" /> : null
      case 'offered':
        return showDot ? <Circle className="h-2 w-2 fill-current" /> : null
      case 'rejected':
        return showDot ? <Circle className="h-2 w-2 fill-current" /> : null
      case 'withdrawn':
        return showDot ? <Circle className="h-2 w-2 fill-current" /> : null
      default:
        return null
    }
  }

  return (
    <span className={`badge flex items-center space-x-1.5 ${getStatusColor(status)}`}>
      {getIcon()}
      <span className="capitalize">{status}</span>
    </span>
  )
}