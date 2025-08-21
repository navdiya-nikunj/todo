"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Flame, Snowflake, Leaf, Moon, Zap, AlertTriangle } from "lucide-react"

// Updated imports to use organized structure
import { RealmCard } from "@/components/realm-quest/realm-card"
import { NavigationHeader } from "@/components/realm-quest/navigation-header"
import { LoadingSpinner } from "@/components/realm-quest/loading-spinner"
import { useAuth } from "@/lib/contexts/auth-context"
import { realmService } from "@/lib/api/services"
import { REALM_THEMES } from "@/lib/constants/realm-quest"
import type { RealmTheme, Realm } from "@/lib/types/realm-quest"

export default function RealmsPage() {
  const router = useRouter()
  const { state: authState } = useAuth()
  const [realms, setRealms] = useState<Realm[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newRealm, setNewRealm] = useState({
    name: "",
    description: "",
    theme: "fire" as RealmTheme,
    difficulty: "medium" as "easy" | "medium" | "hard",
  })

  // Load realms data
  useEffect(() => {
    const loadRealms = async () => {
      if (!authState.isAuthenticated) {
        router.push("/login")
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await realmService.getRealms(1, 50) // Get more realms for now
        setRealms(response.data)
      } catch (err: any) {
        setError(err.message || "Failed to load realms")
        console.error("Realms error:", err)
      } finally {
        setLoading(false)
      }
    }

    loadRealms()
  }, [authState.isAuthenticated, router])

  const handleCreateRealm = async () => {
    if (!newRealm.name.trim()) return

    try {
      setCreating(true)
      const response = await realmService.createRealm({
        name: newRealm.name,
        description: newRealm.description,
        theme: newRealm.theme,
        difficulty: newRealm.difficulty,
      })

      // Add new realm to the list
      setRealms([...realms, response.data])
      setShowCreateModal(false)
      setNewRealm({ name: "", description: "", theme: "fire", difficulty: "medium" })

      // Navigate to the new realm
      router.push(`/realms/${response.data.id}`)
    } catch (err: any) {
      setError(err.message || "Failed to create realm")
      console.error("Create realm error:", err)
    } finally {
      setCreating(false)
    }
  }

  const getThemeIcon = (theme: RealmTheme) => {
    switch (theme) {
      case "fire":
        return <Flame className="w-5 h-5" />
      case "ice":
        return <Snowflake className="w-5 h-5" />
      case "nature":
        return <Leaf className="w-5 h-5" />
      case "shadow":
        return <Moon className="w-5 h-5" />
      case "electric":
        return <Zap className="w-5 h-5" />
      default:
        return <Flame className="w-5 h-5" />
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

  return (
    <div className="min-h-screen p-4">
      {error && (
        <div className="max-w-6xl mx-auto mb-4">
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <NavigationHeader
          title="Realm Management"
          subtitle="Choose your battleground and conquer your tasks"
          backLabel="Back to Dashboard"
          onBack={() => router.push("/dashboard")}
          rightContent={
            <Button className="realm-button text-realm-neon-blue" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Realm
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {realms.map((realm) => (
            <RealmCard
              key={realm.id}
              realm={realm}
              onClick={() => router.push(`/realms/${realm.id}`)}
              showEnterButton={true}
            />
          ))}
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-realm-dark/95 to-realm-gunmetal/95 border border-realm-neon-blue/30 rounded-xl p-6 w-full max-w-md shadow-2xl shadow-realm-neon-blue/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-realm-neon-blue font-space-grotesk">Forge New Realm</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                  className="text-realm-silver hover:text-realm-neon-blue"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-realm-silver mb-2">Realm Name</label>
                  <Input
                    value={newRealm.name}
                    onChange={(e) => setNewRealm({ ...newRealm, name: e.target.value })}
                    placeholder="Enter realm name..."
                    className="bg-realm-gunmetal/50 border-realm-neon-blue/30 text-white placeholder:text-realm-silver/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-realm-silver mb-2">Description</label>
                  <Textarea
                    value={newRealm.description}
                    onChange={(e) => setNewRealm({ ...newRealm, description: e.target.value })}
                    placeholder="Describe your realm..."
                    className="bg-realm-gunmetal/50 border-realm-neon-blue/30 text-white placeholder:text-realm-silver/50 min-h-[80px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-realm-silver mb-2">Realm Theme</label>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(REALM_THEMES).map(([key, theme]) => (
                      <button
                        key={key}
                        onClick={() => setNewRealm({ ...newRealm, theme: key as RealmTheme })}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                          newRealm.theme === key
                            ? `border-${theme.primary} bg-${theme.primary}/20 text-${theme.primary}`
                            : "border-realm-silver/30 bg-realm-gunmetal/30 text-realm-silver hover:border-realm-neon-blue/50"
                        }`}
                      >
                        {getThemeIcon(key as RealmTheme)}
                        <span className="text-xs font-medium capitalize">{key}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-realm-silver mb-2">Difficulty Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "easy", label: "Easy", color: "text-green-400" },
                      { key: "medium", label: "Medium", color: "text-yellow-400" },
                      { key: "hard", label: "Hard", color: "text-red-400" },
                    ].map((diff) => (
                      <button
                        key={diff.key}
                        onClick={() => setNewRealm({ ...newRealm, difficulty: diff.key as any })}
                        className={`p-2 rounded-lg border-2 transition-all duration-200 ${
                          newRealm.difficulty === diff.key
                            ? `border-realm-neon-blue bg-realm-neon-blue/20 ${diff.color}`
                            : "border-realm-silver/30 bg-realm-gunmetal/30 text-realm-silver hover:border-realm-neon-blue/50"
                        }`}
                      >
                        <span className="text-sm font-medium">{diff.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border-realm-silver/30 text-realm-silver hover:bg-realm-silver/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateRealm}
                  disabled={!newRealm.name.trim() || creating}
                  className="flex-1 bg-gradient-to-r from-realm-neon-blue to-realm-neon-blue/80 text-realm-dark font-semibold hover:from-realm-neon-blue/90 hover:to-realm-neon-blue/70 disabled:opacity-50"
                >
                  {creating ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-realm-dark/30 border-t-realm-dark" />
                      Forging...
                    </>
                  ) : (
                    "Forge Realm"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
