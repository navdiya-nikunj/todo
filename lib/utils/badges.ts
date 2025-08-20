import Badge from "@/lib/db/models/Badge"
import User from "@/lib/db/models/User"
import XPHistory from "@/lib/db/models/XPHistory"

// Badge checking and awarding utilities
export async function checkAndAwardBadges(
  userId: string,
  context: {
    tasksCompleted?: number
    currentStreak?: number
    totalXP?: number
    level?: number
  },
) {
  const newBadges: any[] = []

  // Get user's current badges
  const userBadges = await Badge.find({ userId, completed: true })
  const completedBadgeTypes = userBadges.map((badge) => badge.badgeType)

  // First Clear Badge
  if (context.tasksCompleted === 1 && !completedBadgeTypes.includes("first_clear")) {
    const badge = await Badge.findOneAndUpdate(
      { userId, badgeType: "first_clear" },
      {
        completed: true,
        earnedAt: new Date(),
        progress: 1,
      },
      { new: true },
    )

    if (badge) {
      newBadges.push(badge)
      // Award bonus XP
      await awardBonusXP(userId, 20, "first_clear_bonus", "First Clear badge bonus")
    }
  }

  // Streak King Badge
  if (context.currentStreak && context.currentStreak >= 7 && !completedBadgeTypes.includes("streak_king")) {
    const badge = await Badge.findOneAndUpdate(
      { userId, badgeType: "streak_king" },
      {
        completed: true,
        earnedAt: new Date(),
        progress: context.currentStreak,
      },
      { new: true },
    )

    if (badge) {
      newBadges.push(badge)
    }
  }

  // Dungeon Master Badge
  if (context.tasksCompleted && context.tasksCompleted >= 100 && !completedBadgeTypes.includes("dungeon_master")) {
    const badge = await Badge.findOneAndUpdate(
      { userId, badgeType: "dungeon_master" },
      {
        completed: true,
        earnedAt: new Date(),
        progress: context.tasksCompleted,
      },
      { new: true },
    )

    if (badge) {
      newBadges.push(badge)
    }
  }

  // Elite Hunter Badge (Level 10)
  if (context.level && context.level >= 10 && !completedBadgeTypes.includes("elite_hunter")) {
    // First create the badge if it doesn't exist
    let badge = await Badge.findOne({ userId, badgeType: "elite_hunter" })

    if (!badge) {
      badge = new Badge({
        userId,
        badgeType: "elite_hunter",
        name: "Elite Hunter",
        description: "Reach level 10",
        rarity: "legendary",
        progress: 0,
        target: 10,
      })
    }

    badge.completed = true
    badge.earnedAt = new Date()
    badge.progress = context.level
    await badge.save()

    newBadges.push(badge)
  }

  return newBadges
}

export async function awardBonusXP(userId: string, xpAmount: number, source: string, description: string) {
  // Add XP to user
  const user = await User.findById(userId)
  if (user) {
    user.xp += xpAmount
    user.stats.totalXP += xpAmount
    await user.save()

    // Record XP history
    const xpHistory = new XPHistory({
      userId,
      xpGained: xpAmount,
      source,
      description,
    })
    await xpHistory.save()
  }
}

export async function updateBadgeProgress(userId: string, badgeType: string, progress: number) {
  const badge = await Badge.findOne({ userId, badgeType })

  if (badge && !badge.completed) {
    badge.progress = Math.min(progress, badge.target)

    if (badge.progress >= badge.target) {
      badge.completed = true
      badge.earnedAt = new Date()
    }

    await badge.save()
    return badge
  }

  return null
}
