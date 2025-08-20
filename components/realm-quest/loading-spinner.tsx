import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "primary" | "secondary" | "accent"
  className?: string
}

export function LoadingSpinner({ size = "md", variant = "primary", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  }

  const variantClasses = {
    primary: "text-realm-neon",
    secondary: "text-realm-silver",
    accent: "text-realm-crimson",
  }

  return (
    <div className={cn("animate-spin", sizeClasses[size], variantClasses[variant], className)}>
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="31.416"
          className="animate-[spin_2s_linear_infinite] opacity-25"
        />
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="31.416"
          strokeDashoffset="23.562"
          className="animate-[spin_2s_linear_infinite]"
        />
      </svg>
    </div>
  )
}

interface RealmLoadingSpinnerProps {
  className?: string
  text?: string
}

export function RealmLoadingSpinner({ className, text = "Loading..." }: RealmLoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-2 border-realm-neon/20 rounded-full animate-spin">
          <div className="absolute top-0 left-0 w-4 h-4 bg-realm-neon rounded-full animate-pulse" />
        </div>
        {/* Inner ring */}
        <div className="absolute inset-2 w-12 h-12 border-2 border-realm-crimson/30 rounded-full animate-[spin_3s_linear_infinite_reverse]">
          <div className="absolute top-0 right-0 w-3 h-3 bg-realm-crimson rounded-full animate-pulse" />
        </div>
        {/* Core */}
        <div className="absolute inset-4 w-8 h-8 bg-gradient-to-br from-realm-neon/20 to-realm-crimson/20 rounded-full animate-pulse" />
      </div>
      <p className="text-realm-silver/70 text-sm font-medium animate-pulse">{text}</p>
    </div>
  )
}
