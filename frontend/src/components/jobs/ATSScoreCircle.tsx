import { useEffect, useState } from 'react'

interface ATSScoreCircleProps {
  score: number
  size?: number
}

export default function ATSScoreCircle({ score, size = 120 }: ATSScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const id = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(id)
  }, [score])

  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (animatedScore / 100) * circumference

  const getColor = () => {
    if (score >= 80) return { text: 'text-green-600 dark:text-green-400', stroke: '#22c55e' }
    if (score >= 60) return { text: 'text-yellow-600 dark:text-yellow-400', stroke: '#f59e0b' }
    if (score >= 40) return { text: 'text-orange-600 dark:text-orange-400', stroke: '#f97316' }
    return { text: 'text-red-600 dark:text-red-400', stroke: '#ef4444' }
  }

  const { text, stroke } = getColor()

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size}>
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out transform -rotate-90 origin-center"
        />
      </svg>

      {/* Score Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`text-2xl md:text-4xl font-bold ${text}`}>
          {Math.round(animatedScore)}%
        </div>
        <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 font-medium">
          ATS Score
        </div>
      </div>
    </div>
  )
}