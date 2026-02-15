import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../hooks/useAuth'
import { User, Mail, MapPin, Link as LinkIcon, Phone } from 'lucide-react'
import toast from 'react-hot-toast'

interface InputFieldProps {
  label: string
  icon?: React.ReactNode
  value: string
  onChange: (val: string) => void
  type?: string
  placeholder?: string
  disabled?: boolean
  textarea?: boolean
  helperText?: string
}

const InputField = ({
  label,
  icon,
  value,
  onChange,
  type = 'text',
  placeholder,
  disabled,
  textarea,
  helperText,
}: InputFieldProps) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
      {label}
    </label>

    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}

      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder={placeholder}
          disabled={disabled}
          className={`input resize-none ${icon ? 'pl-10' : ''}`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`input ${icon ? 'pl-10' : ''} ${
            disabled
              ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
              : ''
          }`}
        />
      )}
    </div>

    {helperText && (
      <p className="text-xs text-gray-500 dark:text-gray-400">
        {helperText}
      </p>
    )}
  </div>
)

export default function Settings() {
  const { user, updateProfile } = useAuth()

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    location: '',
    linkedIn: '',
    portfolio: '',
    bio: '',
  })

  const [initialValues, setInitialValues] = useState(form)
  const [loading, setLoading] = useState(false)

  // Sync form when user changes
  useEffect(() => {
    if (!user) return

    const values = {
      fullName: user.fullName || '',
      phone: user.profile?.phone || '',
      location: user.profile?.location || '',
      linkedIn: user.profile?.linkedIn || '',
      portfolio: user.profile?.portfolio || '',
      bio: user.profile?.bio || '',
    }

    setForm(values)
    setInitialValues(values)
  }, [user])

  const isDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(initialValues)
  }, [form, initialValues])

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isDirty || !updateProfile) return

    setLoading(true)

    try {
      await updateProfile({
        fullName: form.fullName.trim(),
        profile: {
          phone: form.phone.trim(),
          location: form.location.trim(),
          linkedIn: form.linkedIn.trim(),
          portfolio: form.portfolio.trim(),
          bio: form.bio.trim(),
        },
      })

      toast.success('Profile updated successfully!')
      setInitialValues(form)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  // Single-letter avatar (consistent with navbar)
  const initial =
    user?.fullName?.trim().charAt(0).toUpperCase() || 'U'

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Account Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your personal information and profile details.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="card space-y-8">
        {/* Profile Header */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full  bg-primary-600 text-white flex items-center justify-center text-2xl font-semibold">
            {initial}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {user?.fullName}
            </h2>
            <p className="text-sm text-gray-500">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
            Basic Information
          </h3>

          <InputField
            label="Full Name"
            icon={<User className="h-5 w-5" />}
            value={form.fullName}
            onChange={(val) => handleChange('fullName', val)}
          />

          <InputField
            label="Email"
            icon={<Mail className="h-5 w-5" />}
            value={user?.email || ''}
            onChange={() => {}}
            disabled
            helperText="Email cannot be changed."
          />
        </div>

        {/* Professional Details */}
        <div className="space-y-6">
          <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">
            Professional Details
          </h3>

          <InputField
            label="Phone"
            icon={<Phone className="h-5 w-5" />}
            value={form.phone}
            onChange={(val) => handleChange('phone', val)}
            placeholder="+91 XXXXXXXXXX"
          />

          <InputField
            label="Location"
            icon={<MapPin className="h-5 w-5" />}
            value={form.location}
            onChange={(val) => handleChange('location', val)}
            placeholder="Bangalore, Karnataka"
          />

          <InputField
            label="LinkedIn"
            icon={<LinkIcon className="h-5 w-5" />}
            value={form.linkedIn}
            onChange={(val) => handleChange('linkedIn', val)}
            placeholder="https://linkedin.com/in/yourprofile"
          />

          <InputField
            label="Portfolio"
            icon={<LinkIcon className="h-5 w-5" />}
            value={form.portfolio}
            onChange={(val) => handleChange('portfolio', val)}
            placeholder="https://yourportfolio.com"
          />

          <InputField
            label="Bio"
            value={form.bio}
            onChange={(val) => handleChange('bio', val)}
            placeholder="Brief summary about yourself..."
            textarea
          />
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={!isDirty || loading}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}