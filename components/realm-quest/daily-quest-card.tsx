"use client"
import { Card } from "@/components/ui/card"
import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Sword, Map, Star, Flame, Shield, CheckCircle, Clock } from "lucide-react"
import type { DailyQuest, DailyQuestType, CustomDailyQuest } from "@/lib/types/realm-quest"

interface DailyQuestCardProps {
  quest: DailyQuest | CustomDailyQuest
  onClaim?: (questId: string) => void
  onUpdateProgress?: (questId: string) => void
}

const questIcons: Record<DailyQuestType, React.ComponentType<any>> = {
  complete_tasks: Sword,
  visit_realms: Map,
  earn_xp: Star,
  maintain_streak: Flame,
  defeat_enemies: Shield,
}

export function DailyQuestCard({ quest, onClaim, onUpdateProgress }: DailyQuestCardProps) {
  const IconComponent = quest.questType === "custom" ? Star : questIcons[quest.questType as DailyQuestType]
  const progressPercentage = (quest.progress / quest.target) * 100
  const isExpired = new Date() > new Date(quest.expiresAt)
  const canClaim = quest.completed && !isExpired
  const isCustomQuest = "isCustom" in quest && quest.isCustom

  return (
    <Card
      className={`realm-panel transition-all duration-300 ${
        quest.completed ? "realm-glow border-green-400/50" : "hover:scale-105"
      } ${isCustomQuest ? "border-yellow-400/30" : ""}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                quest.completed ? "bg-green-400/20" : isCustomQuest ? "bg-yellow-400/20" : "bg-realm-neon-blue/20"
              }`}
            >
              <IconComponent
                className={`w-5 h-5 ${
                  quest.completed ? "text-green-400" : isCustomQuest ? "text-yellow-400" : "text-realm-neon-blue"
                }`}
              />
            </div>
            <div>
              <h4 className="font-bold text-realm-silver">{quest.title}</h4>
              <p className="text-sm text-realm-silver/70">{quest.description}</p>
              {isCustomQuest && (
                <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 mt-1">
                  Custom Quest
                </Badge>
              )}
            </div>
          </div>
          {quest.completed && <CheckCircle className="w-6 h-6 text-green-400 animate-pulse" />}
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm text-realm-silver/70 mb-1">
              <span>Progress</span>
              <span>
                {quest.progress} / {quest.target}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-realm-gunmetal" />
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-yellow-400 bg-yellow-400/10 border-yellow-400/30">
              +{quest.xpReward} XP
            </Badge>

            <div className="flex gap-2">
              {isCustomQuest && !quest.completed && (
                <Button
                  size="sm"
                  onClick={() => onUpdateProgress?.(quest.id)}
                  className="realm-button text-yellow-400 hover:bg-yellow-400/20"
                >
                  +1 Progress
                </Button>
              )}

              {isExpired ? (
                <Badge variant="destructive" className="text-red-400 bg-red-400/10 border-red-400/30">
                  <Clock className="w-3 h-3 mr-1" />
                  Expired
                </Badge>
              ) : canClaim ? (
                <Button
                  size="sm"
                  onClick={() => onClaim?.(quest.id)}
                  className="realm-button text-green-400 hover:bg-green-400/20"
                >
                  Claim Reward
                </Button>
              ) : (
                <Badge className="text-realm-neon-blue bg-realm-neon-blue/10 border-realm-neon-blue/30">
                  In Progress
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
