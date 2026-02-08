import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { User, Mail, MapPin, Link as LinkIcon } from 'lucide-react'
import toast from 'react-hot-toast'

// Reusable InputField component
interface InputFieldProps {
  label: string
  icon?: React.ReactNode
  value: string
  onChange: (val: string) => void
  type?: string
  placeholder?: string
  disabled?: boolean
  textarea?: boolean
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
}: InputFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          {icon}
        </span>
      )}
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className={`input resize-none ${icon ? 'pl-10' : ''}`}
          placeholder={placeholder}
          disabled={disabled}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`input ${icon ? 'pl-10' : ''} ${
            disabled ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        />
      )}
    </div>
  </div>
)

export default function Settings() {
  const { user, updateProfile } = useAuth()

  const [fullName, setFullName] = useState(user?.fullName || '')
  const [phone, setPhone] = useState(user?.profile?.phone || '')
  const [location, setLocation] = useState(user?.profile?.location || '')
  const [linkedIn, setLinkedIn] = useState(user?.profile?.linkedIn || '')
  const [portfolio, setPortfolio] = useState(user?.profile?.portfolio || '')
  const [bio, setBio] = useState(user?.profile?.bio || '')
  const [loading, setLoading] = useState(false)

  // Track initial values for dirty check
  const [initialValues, setInitialValues] = useState({
    fullName,
    phone,
    location,
    linkedIn,
    portfolio,
    bio,
  })

  // Sync state with user on load/change
  useEffect(() => {
    if (!user) return
    const vals = {
      fullName: user.fullName || '',
      phone: user.profile?.phone || '',
      location: user.profile?.location || '',
      linkedIn: user.profile?.linkedIn || '',
      portfolio: user.profile?.portfolio || '',
      bio: user.profile?.bio || '',
    }
    setFullName(vals.fullName)
    setPhone(vals.phone)
    setLocation(vals.location)
    setLinkedIn(vals.linkedIn)
    setPortfolio(vals.portfolio)
    setBio(vals.bio)
    setInitialValues(vals)
  }, [user])

  const isDirty =
    fullName !== initialValues.fullName ||
    phone !== initialValues.phone ||
    location !== initialValues.location ||
    linkedIn !== initialValues.linkedIn ||
    portfolio !== initialValues.portfolio ||
    bio !== initialValues.bio

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isDirty || !updateProfile) return

    setLoading(true)
    try {
      await updateProfile({
        fullName,
        profile: { phone, location, linkedIn, portfolio, bio },
      })
      toast.success('Profile updated successfully!')
      setInitialValues({ fullName, phone, location, linkedIn, portfolio, bio })
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <InputField
          label="Full Name"
          icon={<User className="h-5 w-5" />}
          value={fullName}
          onChange={setFullName}
        />

        <InputField
          label="Email"
          icon={<Mail className="h-5 w-5" />}
          value={user?.email || ''}
          onChange={() => {}}
          disabled
        />

        <InputField
          label="Phone"
          value={phone}
          onChange={setPhone}
          placeholder="+1 (555) 123-4567"
        />

        <InputField
          label="Location"
          icon={<MapPin className="h-5 w-5" />}
          value={location}
          onChange={setLocation}
          placeholder="San Francisco, CA"
        />

        <InputField
          label="LinkedIn"
          icon={<LinkIcon className="h-5 w-5" />}
          value={linkedIn}
          onChange={setLinkedIn}
          placeholder="https://linkedin.com/in/yourprofile"
        />

        <InputField
          label="Portfolio"
          icon={<LinkIcon className="h-5 w-5" />}
          value={portfolio}
          onChange={setPortfolio}
          placeholder="https://yourportfolio.com"
        />

        <InputField
          label="Bio"
          value={bio}
          onChange={setBio}
          placeholder="Tell us about yourself..."
          textarea
        />

        <button
          type="submit"
          disabled={loading || !isDirty}
          className="btn btn-primary w-full"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}