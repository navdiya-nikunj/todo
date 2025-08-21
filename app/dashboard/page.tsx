"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sword, Shield, UserIcon, Star, Zap, Flame, CheckCircle, AlertTriangle } from "lucide-react"

// Updated imports to use organized structure
import { UserProfileCard } from "@/components/realm-quest/user-profile-card"
import { RealmCard } from "@/components/realm-quest/realm-card"
import { StatsCard } from "@/components/realm-quest/stats-card"
import { NavigationHeader } from "@/components/realm-quest/navigation-header"
import { DailyQuestCard } from "@/components/realm-quest/daily-quest-card"
import { CreateDailyQuestModal } from "@/components/realm-quest/create-daily-quest-modal"
import { EditDailyQuestModal } from "@/components/realm-quest/edit-daily-quest-modal"
import { LoadingSpinner } from "@/components/realm-quest/loading-spinner"
import { useAuth } from "@/lib/contexts/auth-context"
import { realmService, userService, dailyQuestService } from "@/lib/api/services"
import type { DailyQuest, CustomDailyQuest, CreateCustomQuestData, Realm } from "@/lib/types/realm-quest"

export default function DashboardPage() {
  const router = useRouter()
  const { state: authState, logout } = useAuth()
  const [realms, setRealms] = useState<Realm[]>([])
  const [userStats, setUserStats] = useState<any>(null)
  const [dailyQuests, setDailyQuests] = useState<(DailyQuest | CustomDailyQuest)[]>([])
  const [showQuestReward, setShowQuestReward] = useState<{ xp: number; title: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!authState.isAuthenticated) {
        router.push("/login")
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Load realms, user stats, and daily quests in parallel
        const [realmsResponse, statsResponse, questsResponse] = await Promise.all([
          realmService.getRealms(1, 10),
          userService.getUserStats(),
          dailyQuestService.getDailyQuests(),
        ])

        setRealms(realmsResponse.data)
        setUserStats(statsResponse.data)
        setDailyQuests(questsResponse.data)
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data")
        console.error("Dashboard error:", err)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [authState.isAuthenticated, router])

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
      // Force redirect even if logout fails
      router.push("/login")
    }
  }

  const handleClaimQuest = async (questId: string) => {
    try {
      const response = await dailyQuestService.claimQuestReward(questId)
      
      // Show reward animation
      setShowQuestReward({ 
        xp: response.data.xpGained, 
        title: dailyQuests.find(q => q.id === questId)?.title || "Quest Completed" 
      })
      setTimeout(() => setShowQuestReward(null), 3000)

      // Remove claimed quest from the list
      setDailyQuests((prev) => prev.filter((q) => q.id !== questId))
    } catch (err: any) {
      setError(err.message || "Failed to claim quest reward")
      console.error("Claim quest error:", err)
    }
  }

  const handleCreateCustomQuest = async (questData: CreateCustomQuestData) => {
    try {
      const response = await dailyQuestService.createCustomQuest({
        title: questData.title,
        description: questData.description,
        target: questData.target,
        xpReward: questData.xpReward,
      })
      
      // Add new quest to the list
      setDailyQuests((prev) => [...prev, response.data])
    } catch (err: any) {
      setError(err.message || "Failed to create custom quest")
      console.error("Create custom quest error:", err)
    }
  }

  const handleUpdateQuestProgress = async (questId: string, increment = 1) => {
    try {
      const response = await dailyQuestService.updateQuestProgress(questId, increment)
      
      // Update quest in the list
      setDailyQuests((prev) =>
        prev.map((quest) => (quest.id === questId ? response.data : quest))
      )
    } catch (err: any) {
      setError(err.message || "Failed to update quest progress")
      console.error("Update quest progress error:", err)
    }
  }

  const handleEditQuest = async (questId: string, questData: CreateCustomQuestData) => {
    try {
      const response = await dailyQuestService.updateCustomQuest(questId, questData)
      
      // Update quest in the list
      setDailyQuests((prev) =>
        prev.map((quest) => (quest.id === questId ? response.data : quest))
      )
    } catch (err: any) {
      setError(err.message || "Failed to edit quest")
      console.error("Edit quest error:", err)
    }
  }

  const handleDeleteQuest = async (questId: string) => {
    try {
      await dailyQuestService.deleteCustomQuest(questId)
      
      // Remove quest from the list
      setDailyQuests((prev) => prev.filter((quest) => quest.id !== questId))
    } catch (err: any) {
      setError(err.message || "Failed to delete quest")
      console.error("Delete quest error:", err)
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
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-bold text-realm-silver mb-2">Error Loading Dashboard</h2>
          <p className="text-realm-silver/70 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="realm-button text-realm-neon-blue">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (!authState.data) {
    return null
  }

  return (
    <div className="min-h-screen p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px h-px bg-realm-neon-blue rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {showQuestReward && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="realm-panel p-8 text-center animate-bounce">
            <div className="text-3xl font-serif font-bold text-green-400 mb-2">Quest Complete!</div>
            <div className="text-2xl font-bold text-realm-neon-blue mb-2">+{showQuestReward.xp} XP</div>
            <div className="text-lg text-realm-silver">{showQuestReward.title}</div>
            <div className="flex justify-center mt-2">
              <CheckCircle className="w-6 h-6 text-green-400 animate-spin" />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <NavigationHeader
          title="The Realm Gate"
          subtitle={`Welcome back, ${authState.data.username}. Your adventure continues...`}
          rightContent={
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-realm-crimson/30 text-realm-crimson hover:bg-realm-crimson/10"
            >
              Logout
            </Button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <UserProfileCard user={authState.data} />

          <StatsCard title="Quick Actions" icon={<Star className="w-5 h-5 text-yellow-400 animate-pulse" />}>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/realms")}
                className="w-full realm-button text-realm-neon-blue justify-start transition-all duration-300 hover:scale-105 hover:bg-realm-neon-blue/20"
              >
                <Sword className="w-4 h-4 mr-2 animate-pulse" />
                Manage Realms
              </Button>
              <Button
                onClick={() => router.push("/realms")}
                className="w-full realm-button text-realm-neon-blue justify-start transition-all duration-300 hover:scale-105 hover:bg-realm-neon-blue/20"
              >
                <Shield className="w-4 h-4 mr-2 animate-pulse" />
                View Active Quests
              </Button>
              <Button
                onClick={() => router.push("/avatar")}
                className="w-full realm-button text-realm-neon-blue justify-start transition-all duration-300 hover:scale-105 hover:bg-realm-neon-blue/20"
              >
                <UserIcon className="w-4 h-4 mr-2 animate-pulse" />
                Customize Avatar
              </Button>
            </div>
          </StatsCard>

          <StatsCard title="Hunter Stats" icon={<Zap className="w-5 h-5 text-realm-neon-blue animate-pulse" />}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-realm-silver/70">Current Level</span>
                <span className="text-realm-neon-blue font-bold">{authState.data.level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-realm-silver/70">Total XP</span>
                <span className="text-realm-neon-blue font-bold">{authState.data.xp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-realm-silver/70">Badges Earned</span>
                <span className="text-yellow-400 font-bold">{authState.data.badges?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-realm-silver/70">Active Realms</span>
                <span className="text-green-400 font-bold">{realms.length}</span>
              </div>
            </div>
          </StatsCard>
        </div>

        <StatsCard
          title="Daily Quests"
          icon={<Flame className="w-6 h-6 text-yellow-400 animate-pulse" />}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <p className="text-realm-silver/70">Complete daily challenges to earn bonus XP</p>
            <CreateDailyQuestModal onCreateQuest={handleCreateCustomQuest} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {dailyQuests.map((quest) => (
                <DailyQuestCard
                  key={quest.id}
                  quest={quest}
                  onClaim={handleClaimQuest}
                  onUpdateProgress={(questId) => handleUpdateQuestProgress(questId, 1)}
                  onEditQuest={handleEditQuest}
                  onDeleteQuest={handleDeleteQuest}
                />
              ))}
          </div>

          {dailyQuests.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-400" />
              <h4 className="font-bold text-realm-silver mb-2">All Daily Quests Complete!</h4>
              <p className="text-realm-silver/70">Return tomorrow for new challenges and rewards.</p>
            </div>
          )}
        </StatsCard>

        <StatsCard
          title="Active Realms"
          icon={<Sword className="w-6 h-6 text-realm-neon-blue animate-pulse" />}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div />
            <Button onClick={() => router.push("/realms")} className="realm-button text-realm-neon-blue">
              View All Realms
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {realms.slice(0, 3).map((realm) => (
              <RealmCard key={realm.id} realm={realm} onClick={() => router.push(`/realms/${realm.id}`)} />
            ))}
          </div>
        </StatsCard>
      </div>
    </div>
  )
}
