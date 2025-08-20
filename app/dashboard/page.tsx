"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sword, Shield, UserIcon, Star, Zap, Flame, CheckCircle } from "lucide-react"

// Updated imports to use organized structure
import { UserProfileCard } from "@/components/realm-quest/user-profile-card"
import { RealmCard } from "@/components/realm-quest/realm-card"
import { StatsCard } from "@/components/realm-quest/stats-card"
import { NavigationHeader } from "@/components/realm-quest/navigation-header"
import { DailyQuestCard } from "@/components/realm-quest/daily-quest-card"
import { CreateDailyQuestModal } from "@/components/realm-quest/create-daily-quest-modal"
import { generateDailyQuests, createCustomDailyQuest, updateCustomQuestProgress } from "@/lib/utils/realm-quest"
import type { DailyQuest, CustomDailyQuest, CreateCustomQuestData } from "@/lib/types/realm-quest"
import { mockUser, mockRealms } from "@/lib/data/mock-data"
import { formatSuccessRate } from "@/lib/utils/realm-quest"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(mockUser)
  const [realms] = useState(mockRealms)
  const [dailyQuests, setDailyQuests] = useState<(DailyQuest | CustomDailyQuest)[]>(() => generateDailyQuests())
  const [showQuestReward, setShowQuestReward] = useState<{ xp: number; title: string } | null>(null)

  const handleClaimQuest = (questId: string) => {
    const quest = dailyQuests.find((q) => q.id === questId)
    if (!quest || !quest.completed) return

    // Award XP to user
    setUser((prev) => ({ ...prev, xp: prev.xp + quest.xpReward }))

    // Show reward animation
    setShowQuestReward({ xp: quest.xpReward, title: quest.title })
    setTimeout(() => setShowQuestReward(null), 3000)

    // Remove claimed quest (in real app, this would be handled by backend)
    setDailyQuests((prev) => prev.filter((q) => q.id !== questId))
  }

  const handleCreateCustomQuest = (questData: CreateCustomQuestData) => {
    const newQuest = createCustomDailyQuest(questData)
    setDailyQuests((prev) => [...prev, newQuest])
  }

  const handleUpdateQuestProgress = (questId: string) => {
    setDailyQuests((prev) =>
      prev.map((quest) => {
        if (quest.id === questId && "isCustom" in quest && quest.isCustom) {
          return updateCustomQuestProgress(quest as CustomDailyQuest)
        }
        return quest
      }),
    )
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
          subtitle={`Welcome back, ${user.name}. Your adventure continues...`}
          rightContent={
            <Button
              onClick={() => router.push("/login")}
              variant="outline"
              className="border-realm-crimson/30 text-realm-crimson hover:bg-realm-crimson/10"
            >
              Logout
            </Button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <UserProfileCard user={user} />

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
                <span className="text-realm-neon-blue font-bold">{user.level}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-realm-silver/70">Total XP</span>
                <span className="text-realm-neon-blue font-bold">{user.xp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-realm-silver/70">Badges Earned</span>
                <span className="text-yellow-400 font-bold">{user.badges.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-realm-silver/70">Success Rate</span>
                <span className="text-green-400 font-bold">{formatSuccessRate(user.stats.tasksCompleted)}%</span>
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
                onUpdateProgress={handleUpdateQuestProgress}
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
