export const JOB_STATUSES = {
  saved: { label: 'Saved', color: 'gray' },
  applied: { label: 'Applied', color: 'blue' },
  interviewing: { label: 'Interviewing', color: 'yellow' },
  offered: { label: 'Offered', color: 'green' },
  rejected: { label: 'Rejected', color: 'red' },
  withdrawn: { label: 'Withdrawn', color: 'gray' },
} as const

export const ALLOWED_RESUME_TYPES = [
  'application/pdf',
]

export const MAX_RESUME_SIZE = 5 * 1024 * 1024 // 5MB

export const API_BASE_URL = import.meta.env.VITE_API_URL