"use client"
import { Button } from "@/components/ui/button"
import type React from "react"

import { ArrowRight } from "lucide-react"

interface NavigationHeaderProps {
  title: string
  subtitle?: string
  backLabel?: string
  onBack?: () => void
  rightContent?: React.ReactNode
}

export function NavigationHeader({ title, subtitle, backLabel = "Back", onBack, rightContent }: NavigationHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 sm:items-center">
          {onBack && (
            <Button
              onClick={onBack}
              variant="outline"
              className="border-realm-neon-blue/30 text-realm-neon-blue hover:bg-realm-neon-blue/10 bg-transparent"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              {backLabel}
            </Button>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-realm-neon-blue break-words">{title}</h1>
            {subtitle && <p className="text-realm-silver/70 text-sm break-words">{subtitle}</p>}
          </div>
        </div>
        {rightContent && (
          <div className="mt-2 sm:mt-0 w-full sm:w-auto flex flex-wrap justify-start sm:justify-end gap-2">
            {rightContent}
          </div>
        )}
      </div>
    </header>
  )
}
