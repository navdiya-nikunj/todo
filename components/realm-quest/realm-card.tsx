"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import type { Realm } from "@/lib/types/realm-quest"
import { getThemeColor, getDifficultyColor, calculateProgressPercentage } from "@/lib/utils/realm-quest"
import { ThemeIcon } from "./theme-icons"

interface RealmCardProps {
  realm: Realm
  onClick?: () => void
  showEnterButton?: boolean
}

export function RealmCard({ realm, onClick, showEnterButton = false }: RealmCardProps) {
  const progressPercentage = calculateProgressPercentage(realm.tasksCompleted, realm.totalTasks)
  const isCompleted = realm.tasksCompleted === realm.totalTasks

  return (
    <Card
      className={`realm-panel cursor-pointer transition-all duration-300 hover:scale-105 hover:realm-glow ${getThemeColor(realm.theme)}`}
      onClick={onClick}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ThemeIcon theme={realm.theme} />
            <h4 className="font-serif font-bold text-realm-silver">{realm.name}</h4>
          </div>
          {realm.difficulty && (
            <Badge variant="secondary" className={`text-xs ${getDifficultyColor(realm.difficulty)}`}>
              {realm.difficulty.toUpperCase()}
            </Badge>
          )}
        </div>

        <p className="text-sm text-realm-silver/70 mb-3">{realm.description}</p>

        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-realm-silver/70 mb-1">
            <span>Progress</span>
            <span>
              {realm.tasksCompleted}/{realm.totalTasks} {showEnterButton ? "tasks" : ""}
            </span>
          </div>
          <div className="w-full bg-realm-gunmetal rounded-full h-2">
            <div
              className="h-full bg-gradient-to-r from-realm-neon-blue to-blue-400 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge
            variant="secondary"
            className={`text-xs ${
              isCompleted
                ? "text-green-400 bg-green-400/10 border-green-400/30"
                : "text-realm-neon-blue bg-realm-neon-blue/10 border-realm-neon-blue/30"
            }`}
          >
            {isCompleted ? "Completed" : "In Progress"}
          </Badge>
          {showEnterButton && (
            <Button
              size="sm"
              className="realm-button text-realm-neon-blue text-xs"
              onClick={(e) => {
                e.stopPropagation()
                onClick?.()
              }}
            >
              Enter Realm
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
