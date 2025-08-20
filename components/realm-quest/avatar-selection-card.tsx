"use client"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Lock, Crown } from "lucide-react"

interface AvatarOption {
  id: string
  name: string
  image: string
  category: "starter" | "level" | "badge" | "premium"
  unlockRequirement?: {
    type: "level" | "badge" | "tasks" | "realms"
    value: number | string
  }
  description: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

interface AvatarSelectionCardProps {
  avatar: AvatarOption
  isSelected: boolean
  isUnlocked: boolean
  onClick: () => void
  unlockRequirementText?: string
}

const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case "common":
      return "border-gray-400/30 bg-gray-400/5"
    case "rare":
      return "border-blue-400/30 bg-blue-400/5"
    case "epic":
      return "border-purple-400/30 bg-purple-400/5"
    case "legendary":
      return "border-yellow-400/30 bg-yellow-400/5"
    default:
      return "border-gray-400/30 bg-gray-400/5"
  }
}

const getRarityTextColor = (rarity: string) => {
  switch (rarity) {
    case "common":
      return "text-gray-400"
    case "rare":
      return "text-blue-400"
    case "epic":
      return "text-purple-400"
    case "legendary":
      return "text-yellow-400"
    default:
      return "text-gray-400"
  }
}

export function AvatarSelectionCard({
  avatar,
  isSelected,
  isUnlocked,
  onClick,
  unlockRequirementText,
}: AvatarSelectionCardProps) {
  return (
    <Card
      className={`realm-panel transition-all duration-300 ${
        isUnlocked
          ? `cursor-pointer hover:realm-glow ${isSelected ? "border-realm-neon-blue/50 bg-realm-neon-blue/5" : ""}`
          : "opacity-50 cursor-not-allowed"
      } ${getRarityColor(avatar.rarity)}`}
      onClick={() => {
        if (isUnlocked) {
          onClick()
        }
      }}
    >
      <div className="p-4 text-center">
        <div className="relative mx-auto w-16 h-16 mb-3">
          <Avatar className="w-full h-full border border-realm-neon-blue/30">
            <AvatarImage
              src={avatar.image || "/placeholder.svg"}
              alt={avatar.name}
              className={isUnlocked ? "" : "grayscale"}
            />
            <AvatarFallback className="bg-realm-gunmetal text-realm-neon-blue text-sm font-bold">
              {avatar.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {!isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
              <Lock className="w-6 h-6 text-realm-silver" />
            </div>
          )}
          {isUnlocked && avatar.rarity === "legendary" && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
              <Crown className="w-3 h-3 text-black" />
            </div>
          )}
        </div>
        <h4 className="font-serif font-bold text-realm-silver text-sm mb-1">{avatar.name}</h4>
        <Badge
          variant="secondary"
          className={`${getRarityTextColor(avatar.rarity)} bg-transparent border-current text-xs mb-2`}
        >
          {avatar.rarity}
        </Badge>
        {!isUnlocked && unlockRequirementText && (
          <p className="text-xs text-realm-silver/60">{unlockRequirementText}</p>
        )}
      </div>
    </Card>
  )
}
