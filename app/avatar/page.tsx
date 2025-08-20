"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Palette, Eye } from "lucide-react"

// Updated imports to use organized structure
import { NavigationHeader } from "@/components/realm-quest/navigation-header"
import { AvatarSelectionCard } from "@/components/realm-quest/avatar-selection-card"
import { mockUser, availableAvatars, availableBadges } from "@/lib/data/mock-data"
import { isAvatarUnlocked, getUnlockRequirementText, getRarityTextColor } from "@/lib/utils/realm-quest"

export default function AvatarPage() {
  const router = useRouter()
  const [selectedAvatarId, setSelectedAvatarId] = useState("starter_warrior")
  const [avatarRotation, setAvatarRotation] = useState(0)
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null)
  const [user] = useState(mockUser)

  const currentAvatar = availableAvatars.find((a) => a.id === selectedAvatarId) || availableAvatars[0]

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <NavigationHeader
          title="Avatar Forge"
          subtitle="Customize your hunter's appearance"
          backLabel="Back to Dashboard"
          onBack={() => router.push("/dashboard")}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 realm-panel realm-glow">
            <div className="p-6">
              <h3 className="text-lg font-serif font-bold text-realm-silver mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-realm-neon-blue" />
                Avatar Preview
              </h3>

              <div className="relative mb-6">
                <div className="relative mx-auto w-48 h-48 rounded-full bg-gradient-to-br from-realm-neon-blue/10 to-realm-neon-blue/5 border-2 border-realm-neon-blue/30 overflow-hidden">
                  <div
                    className="absolute inset-2 rounded-full overflow-hidden transition-transform duration-500"
                    style={{ transform: `rotateY(${avatarRotation}deg)` }}
                  >
                    <Avatar className="w-full h-full">
                      <AvatarImage
                        src={previewAvatar || currentAvatar.image}
                        alt={currentAvatar.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-realm-gunmetal text-realm-neon-blue text-4xl font-bold">
                        {currentAvatar.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-realm-neon-blue/5 to-transparent animate-pulse"></div>
                  <div className="absolute inset-0 border border-realm-neon-blue/20 rounded-full animate-pulse"></div>
                </div>

                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    onClick={() => setAvatarRotation((prev) => prev - 45)}
                    variant="outline"
                    size="sm"
                    className="border-realm-neon-blue/30 text-realm-neon-blue hover:bg-realm-neon-blue/10"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setAvatarRotation(0)}
                    variant="outline"
                    size="sm"
                    className="border-realm-neon-blue/30 text-realm-neon-blue hover:bg-realm-neon-blue/10"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={() => setAvatarRotation((prev) => prev + 45)}
                    variant="outline"
                    size="sm"
                    className="border-realm-neon-blue/30 text-realm-neon-blue hover:bg-realm-neon-blue/10"
                  >
                    <RotateCcw className="w-4 h-4 scale-x-[-1]" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-serif font-bold text-realm-silver mb-1">{currentAvatar.name}</h4>
                  <p className="text-sm text-realm-silver/70 mb-2">{currentAvatar.description}</p>
                  <Badge
                    variant="secondary"
                    className={`${getRarityTextColor(currentAvatar.rarity)} bg-transparent border-current`}
                  >
                    {currentAvatar.rarity.charAt(0).toUpperCase() + currentAvatar.rarity.slice(1)}
                  </Badge>
                </div>

                <Button className="w-full realm-button text-realm-neon-blue">
                  <Palette className="w-4 h-4 mr-2" />
                  Equip Avatar
                </Button>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="realm-panel">
              <div className="p-6">
                <h3 className="text-lg font-serif font-bold text-realm-silver mb-4">Available Avatars</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availableAvatars.map((avatar) => {
                    const unlocked = isAvatarUnlocked(avatar, user)
                    return (
                      <AvatarSelectionCard
                        key={avatar.id}
                        avatar={avatar}
                        isSelected={selectedAvatarId === avatar.id}
                        isUnlocked={unlocked}
                        onClick={() => {
                          setSelectedAvatarId(avatar.id)
                          setPreviewAvatar(avatar.image)
                        }}
                        unlockRequirementText={getUnlockRequirementText(avatar, availableBadges)}
                      />
                    )
                  })}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
