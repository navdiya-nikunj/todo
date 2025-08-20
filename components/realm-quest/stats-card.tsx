"use client"
import { Card } from "@/components/ui/card"
import type { ReactNode } from "react"

interface StatsCardProps {
  title: string
  icon: ReactNode
  children: ReactNode
  className?: string
}

export function StatsCard({ title, icon, children, className = "" }: StatsCardProps) {
  return (
    <Card className={`realm-panel realm-glow transition-all duration-300 hover:scale-105 ${className}`}>
      <div className="p-6">
        <h3 className="text-lg font-serif font-bold text-realm-silver mb-4 flex items-center gap-2">
          {icon}
          {title}
        </h3>
        {children}
      </div>
    </Card>
  )
}
