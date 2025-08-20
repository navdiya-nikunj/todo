"use client"

interface ProgressBarProps {
  current: number
  max: number
  label?: string
  showNumbers?: boolean
  className?: string
  barClassName?: string
}

export function ProgressBar({
  current,
  max,
  label,
  showNumbers = true,
  className = "",
  barClassName = "bg-gradient-to-r from-realm-neon-blue to-blue-400",
}: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100)

  return (
    <div className={className}>
      {(label || showNumbers) && (
        <div className="flex items-center justify-between text-xs text-realm-silver/70 mb-1">
          {label && <span>{label}</span>}
          {showNumbers && (
            <span>
              {current} / {max}
            </span>
          )}
        </div>
      )}
      <div className="w-full bg-realm-gunmetal rounded-full h-2">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barClassName}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
