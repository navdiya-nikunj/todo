import type React from "react"
import { cn } from "@/lib/utils"
import { RealmLoadingSpinner } from "./loading-spinner"

interface LoadingOverlayProps {
  isLoading: boolean
  text?: string
  className?: string
  children: React.ReactNode
}

export function LoadingOverlay({ isLoading, text, className, children }: LoadingOverlayProps) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-realm-black/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <RealmLoadingSpinner text={text} />
        </div>
      )}
    </div>
  )
}

interface FullScreenLoadingProps {
  isLoading: boolean
  text?: string
}

export function FullScreenLoading({ isLoading, text = "Entering Realm..." }: FullScreenLoadingProps) {
  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-realm-black/90 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="text-center space-y-6">
        <RealmLoadingSpinner text={text} />
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-realm-neon rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          <p className="text-realm-silver/50 text-xs">Please wait while we prepare your adventure...</p>
        </div>
      </div>
    </div>
  )
}

interface ButtonLoadingProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
}

export function ButtonLoading({ isLoading, children, className }: ButtonLoadingProps) {
  return (
    <div className={cn("relative", className)}>
      <div className={cn("transition-opacity duration-200", isLoading && "opacity-0")}>{children}</div>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Processing...</span>
          </div>
        </div>
      )}
    </div>
  )
}
