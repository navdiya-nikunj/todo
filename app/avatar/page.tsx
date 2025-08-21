"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Palette, Eye, AlertTriangle } from "lucide-react"

// Updated imports to use organized structure
import { NavigationHeader } from "@/components/realm-quest/navigation-header"
import { AvatarSelectionCard } from "@/components/realm-quest/avatar-selection-card"
import { LoadingSpinner } from "@/components/realm-quest/loading-spinner"
import { useAuth } from "@/lib/contexts/auth-context"
import { avatarService } from "@/lib/api/services"
import { getRarityTextColor } from "@/lib/utils/realm-quest"

export default function AvatarPage() {
  const router = useRouter()
  const { state: authState, updateAvatar } = useAuth()
  const [selectedAvatarId, setSelectedAvatarId] = useState("")
  const [avatarRotation, setAvatarRotation] = useState(0)
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null)
  const [avatars, setAvatars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load available avatars
  useEffect(() => {
    const loadAvatars = async () => {
      if (!authState.isAuthenticated) {
        router.push("/login")
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await avatarService.getAvailableAvatars() as any
        setAvatars(response.data.avatars || [])
        setSelectedAvatarId(response.data.currentAvatar || "")
      } catch (err: any) {
        setError(err.message || "Failed to load avatars")
        console.error("Avatar error:", err)
      } finally {
        setLoading(false)
      }
    }

    loadAvatars()
  }, [authState.isAuthenticated, router])

  const currentAvatar = avatars.find((a) => a.id === selectedAvatarId) || avatars[0]

  const handleEquipAvatar = async () => {
    if (!selectedAvatarId || selectedAvatarId === authState.data?.avatar) return

    try {
      setUpdating(true)
      await updateAvatar(selectedAvatarId)
      // Success feedback could be added here
    } catch (err: any) {
      setError(err.message || "Failed to update avatar")
      console.error("Update avatar error:", err)
    } finally {
      setUpdating(false)
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Show error state
  if (error && avatars.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-bold text-realm-silver mb-2">Failed to Load Avatars</h2>
          <p className="text-realm-silver/70 mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => window.location.reload()} className="realm-button text-realm-neon-blue">
              Try Again
            </Button>
            <Button onClick={() => router.push("/dashboard")} variant="outline" className="border-realm-silver/30 text-realm-silver">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentAvatar) {
    return null
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

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
                        src={previewAvatar || `/avatars/${currentAvatar?.id}.png`}
                        alt={currentAvatar?.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-realm-gunmetal text-realm-neon-blue text-4xl font-bold">
                        {currentAvatar?.name
                          .split(" ")
                          .map((n: string) => n[0])
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
                  <h4 className="font-serif font-bold text-realm-silver mb-1">{currentAvatar?.name}</h4>
                  <p className="text-sm text-realm-silver/70 mb-2">{currentAvatar?.description}</p>
                  <Badge
                    variant="secondary"
                    className={`${getRarityTextColor(currentAvatar?.rarity)} bg-transparent border-current`}
                  >
                    {currentAvatar?.rarity?.charAt(0).toUpperCase() + currentAvatar?.rarity?.slice(1)}
                  </Badge>
                </div>

                <Button 
                  className="w-full realm-button text-realm-neon-blue"
                  onClick={handleEquipAvatar}
                  disabled={updating || selectedAvatarId === authState.data?.avatar}
                >
                  {updating ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-realm-neon-blue/30 border-t-realm-neon-blue" />
                      Equipping...
                    </>
                  ) : selectedAvatarId === authState.data?.avatar ? (
                    <>
                      <Eye className="w-4 h-4 mr-2" />
                      Currently Equipped
                    </>
                  ) : (
                    <>
                  <Palette className="w-4 h-4 mr-2" />
                  Equip Avatar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card className="realm-panel">
              <div className="p-6">
                <h3 className="text-lg font-serif font-bold text-realm-silver mb-4">Available Avatars</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {avatars.map((avatar) => (
                      <AvatarSelectionCard
                        key={avatar.id}
                        avatar={avatar}
                        isSelected={selectedAvatarId === avatar.id}
                      isUnlocked={avatar.unlocked}
                        onClick={() => {
                        if (avatar.unlocked) {
                          setSelectedAvatarId(avatar.id)
                          setPreviewAvatar(`/avatars/${avatar.id}.png`)
                        }
                        }}
                      unlockRequirementText={avatar.unlockRequirement?.requirement || ""}
                      />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
