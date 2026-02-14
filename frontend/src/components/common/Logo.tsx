import logo from '../../assets/logo.png'

interface LogoProps {
  size?: number
  showText?: boolean
  className?: string
}

export default function Logo({
  size = 40,
  showText = false,
  className = ''
}: LogoProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <img
        src={logo}
        alt="ApplyTrack Logo"
        style={{ height: size }}
        className="w-auto object-contain block"
      />

      {showText && (
        <span className="text-xl font-bold text-primary-600 dark:text-primary-400 leading-none">
          ApplyTrack
        </span>
      )}
    </div>
  )
}