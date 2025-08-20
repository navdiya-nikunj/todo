import type React from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max: number
  className?: string
  showText?: boolean
  variant?: "xp" | "health" | "progress"
}

export function ProgressBar({ value, max, className, showText = true, variant = "progress" }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  const variantClasses = {
    xp: "bg-realm-neon",
    health: "bg-realm-crimson",
    progress: "bg-gradient-to-r from-realm-neon to-realm-crimson",
  }

  return (
    <div className={cn("space-y-1", className)}>
      {showText && (
        <div className="flex justify-between text-sm text-realm-silver/70">
          <span>{variant === "xp" ? "XP" : variant === "health" ? "HP" : "Progress"}</span>
          <span>
            {value.toLocaleString()} / {max.toLocaleString()}
          </span>
        </div>
      )}
      <div className="h-2 bg-realm-gunmetal/50 rounded-full overflow-hidden">
        <div
          className={cn("h-full transition-all duration-500 ease-out", variantClasses[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

interface CircularProgressProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  className?: string
  children?: React.ReactNode
}

export function CircularProgress({
  value,
  max,
  size = 120,
  strokeWidth = 8,
  className,
  children,
}: CircularProgressProps) {
  const percentage = Math.min((value / max) * 100, 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-realm-gunmetal/30"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-realm-neon transition-all duration-500 ease-out"
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  )
}

interface LoadingDotsProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingDots({ className, size = "md" }: LoadingDotsProps) {
  const sizeClasses = {
    sm: "w-1 h-1",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className={cn("bg-current rounded-full animate-bounce", sizeClasses[size])}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  )
}
