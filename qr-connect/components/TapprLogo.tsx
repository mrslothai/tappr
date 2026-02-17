interface TapprLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  className?: string
}

const sizes = {
  sm: { icon: 24, text: 'text-lg' },
  md: { icon: 32, text: 'text-2xl' },
  lg: { icon: 40, text: 'text-3xl' },
  xl: { icon: 56, text: 'text-5xl' },
}

export default function TapprLogo({ size = 'md', showText = true, className = '' }: TapprLogoProps) {
  const s = sizes[size]

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Icon Mark — Stylized T with tap ripple */}
      <svg
        width={s.icon}
        height={s.icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tappr-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="tappr-grad2" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
        </defs>
        {/* Rounded square background */}
        <rect x="2" y="2" width="60" height="60" rx="16" fill="url(#tappr-grad)" />
        {/* Inner glow */}
        <rect x="2" y="2" width="60" height="60" rx="16" fill="white" fillOpacity="0.1" />
        {/* Tap ripple rings */}
        <circle cx="32" cy="34" r="22" stroke="white" strokeOpacity="0.15" strokeWidth="1.5" fill="none" />
        <circle cx="32" cy="34" r="16" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" fill="none" />
        {/* Stylized T */}
        <path
          d="M20 18H44M32 18V46"
          stroke="white"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Tap dot at bottom of T */}
        <circle cx="32" cy="46" r="4" fill="white" />
        {/* Small shine */}
        <circle cx="18" cy="14" r="3" fill="white" fillOpacity="0.25" />
      </svg>

      {/* Wordmark */}
      {showText && (
        <span className={`${s.text} font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent`}>
          Tappr
        </span>
      )}
    </div>
  )
}
