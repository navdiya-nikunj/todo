"use client"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Crown } from "lucide-react"
import type { UserProfile } from "@/lib/types/realm-quest"
import { getXPForNextLevel, getXPProgress } from "@/lib/utils/realm-quest"

interface UserProfileCardProps {
  user: UserProfile
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <Card className="realm-panel realm-glow transition-all duration-500 hover:scale-105">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <Avatar className="w-16 h-16 border-2 border-realm-neon-blue/50 realm-glow">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="bg-realm-gunmetal text-realm-neon-blue text-xl font-bold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-realm-neon-blue rounded-full flex items-center justify-center">
              <Crown className="w-3 h-3 text-realm-black" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-realm-silver">{user.name}</h3>
            <p className="text-realm-neon-blue font-semibold">Level {user.level} Hunter</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between text-sm text-realm-silver/70 mb-2">
              <span>XP Progress</span>
              <span>
                {user.xp} / {getXPForNextLevel(user.xp)}
              </span>
            </div>
            <div className="w-full bg-realm-gunmetal rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-realm-neon-blue to-blue-400 transition-all duration-1000 ease-out animate-pulse"
                style={{ width: `${getXPProgress(user.xp)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="realm-panel p-3">
              <div className="text-2xl font-bold text-realm-neon-blue">{user.stats.tasksCompleted}</div>
              <div className="text-xs text-realm-silver/70">Tasks Defeated</div>
            </div>
            <div className="realm-panel p-3">
              <div className="text-2xl font-bold text-realm-neon-blue">{user.stats.realmsCleared}</div>
              <div className="text-xs text-realm-silver/70">Realms Cleared</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-realm-silver mb-2">Earned Badges</h4>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge) => (
                <Badge
                  key={badge.id}
                  variant="secondary"
                  className="text-yellow-400 bg-yellow-400/10 border-yellow-400/30 animate-pulse"
                >
                  {badge.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
