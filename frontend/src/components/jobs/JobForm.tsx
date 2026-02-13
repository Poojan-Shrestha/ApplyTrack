import { useState } from 'react'
import type { Job, JobStatus } from '../../types'
import { X, Loader2, DollarSign, IndianRupee } from 'lucide-react'

interface JobFormProps {
  job?: Job
  onSubmit: (data: Partial<Job>) => Promise<void>
  onCancel: () => void
}

export default function JobForm({ job, onSubmit, onCancel }: JobFormProps) {
  const [loading, setLoading] = useState(false)

  const [currency, setCurrency] = useState<'USD' | 'INR'>(
    job?.salaryRange?.includes('₹') ? 'INR' : 'USD'
  )

  const [formData, setFormData] = useState({
    title: job?.title || '',
    company: job?.company || '',
    location: job?.location || '',
    jobUrl: job?.jobUrl || '',
    salaryRange: job?.salaryRange || '',
    description: job?.description || '',
    requirements: job?.requirements || '',
    status: (job?.status || 'saved') as JobStatus,
    appliedDate: job?.appliedDate || '',
    notes: job?.notes || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // 🔥 Salary Formatter
  const formatNumber = (value: string, currency: 'USD' | 'INR') => {
    const numbersOnly = value.replace(/[^\d]/g, '')
    if (!numbersOnly) return ''

    const number = parseInt(numbersOnly, 10)

    if (currency === 'USD') {
      return '$' + new Intl.NumberFormat('en-US').format(number)
    } else {
      return '₹' + new Intl.NumberFormat('en-IN').format(number)
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = 'Job title is required'
    if (!formData.company.trim()) newErrors.company = 'Company name is required'
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validate()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    if (name === 'salaryRange') {
      const formatted = formatNumber(value, currency)
      setFormData(prev => ({ ...prev, salaryRange: formatted }))
      return
    }

    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {job ? 'Edit Job' : 'Add New Job'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Title & Company */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input"
                placeholder="Software Engineer"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="input"
                placeholder="Google"
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company}</p>
              )}
            </div>
          </div>

          {/* Location & Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input"
                placeholder="San Francisco, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Salary
              </label>

              <div className="flex gap-2">

                {/* Currency Toggle */}
                <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrency('USD')
                      setFormData(prev => ({
                        ...prev,
                        salaryRange: formatNumber(prev.salaryRange, 'USD'),
                      }))
                    }}
                    className={`px-3 py-2 flex items-center gap-1 ${
                      currency === 'USD'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800'
                    }`}
                  >
                    <DollarSign className="h-4 w-4" />
                    USD
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCurrency('INR')
                      setFormData(prev => ({
                        ...prev,
                        salaryRange: formatNumber(prev.salaryRange, 'INR'),
                      }))
                    }}
                    className={`px-3 py-2 flex items-center gap-1 ${
                      currency === 'INR'
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-gray-800'
                    }`}
                  >
                    <IndianRupee className="h-4 w-4" />
                    INR
                  </button>
                </div>

                <input
                  type="text"
                  name="salaryRange"
                  value={formData.salaryRange}
                  onChange={handleChange}
                  className="input flex-1"
                  placeholder={currency === 'USD' ? '120000' : '1500000'}
                />
              </div>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {currency === 'USD'
                  ? 'Example: 120000 → $120,000'
                  : 'Example: 1500000 → ₹15,00,000'}
              </p>
            </div>
          </div>

          {/* Job URL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Job Posting URL
            </label>
            <input
              type="url"
              name="jobUrl"
              value={formData.jobUrl}
              onChange={handleChange}
              className="input"
              placeholder="https://..."
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input"
            >
              <option value="saved">Saved</option>
              <option value="applied">Applied</option>
              <option value="interviewing">Interviewing</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>

          {/* Applied Date */}
          {formData.status === 'applied' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Applied Date
              </label>
              <input
                type="date"
                name="appliedDate"
                value={formData.appliedDate?.split('T')[0] || ''}
                onChange={handleChange}
                className="input"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input resize-none"
              placeholder="Paste the job description here..."
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Requirements
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={3}
              className="input resize-none"
              placeholder="Key requirements and qualifications..."
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="input resize-none"
              placeholder="Add any personal notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {job ? 'Update Job' : 'Add Job'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}