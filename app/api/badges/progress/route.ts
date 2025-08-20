import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Badge from "@/lib/db/models/Badge"
import User from "@/lib/db/models/User"
import Task from "@/lib/db/models/Task"
import Realm from "@/lib/db/models/Realm"
import { withAuth } from "@/lib/auth/middleware"

export const GET = withAuth(async (request) => {
  try {
    await connectDB()

    const user = await User.findById(request.user.userId)
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      )
    }

    // Get current user statistics
    const [completedTasks, totalRealms, currentStreak] = await Promise.all([
      Task.countDocuments({ userId: user._id, status: "completed" }),
      Realm.countDocuments({ userId: user._id }),
      calculateCurrentStreak(user._id.toString()),
    ])

    // Get all badges for the user
    const badges = await Badge.find({ userId: user._id })

    // Calculate progress for each badge
    const badgeProgress = await Promise.all(
      badges.map(async (badge) => {
        let currentProgress = badge.progress

        switch (badge.badgeType) {
          case "first_clear":
            currentProgress = Math.min(completedTasks, 1)
            break
          case "dungeon_master":
            currentProgress = completedTasks
            break
          case "streak_king":
            currentProgress = currentStreak
            break
          case "elite_hunter":
            currentProgress = user.level
            break
          case "speed_runner":
            // Calculate tasks completed within 1 hour
            const speedTasks = await Task.countDocuments({
              userId: user._id,
              status: "completed",
              $expr: {
                $lte: [{ $subtract: ["$completedAt", "$createdAt"] }, 3600000], // 1 hour in milliseconds
              },
            })
            currentProgress = speedTasks
            break
          case "perfectionist":
            // Calculate completion rate over last 30 days
            const thirtyDaysAgo = new Date()
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

            const [recentTotal, recentCompleted] = await Promise.all([
              Task.countDocuments({
                userId: user._id,
                createdAt: { $gte: thirtyDaysAgo },
              }),
              Task.countDocuments({
                userId: user._id,
                status: "completed",
                createdAt: { $gte: thirtyDaysAgo },
              }),
            ])

            const completionRate = recentTotal > 0 ? (recentCompleted / recentTotal) * 100 : 0
            currentProgress = completionRate >= 100 ? 30 : 0 // 30 days of perfect completion
            break
          case "night_watch":
            // Count tasks completed after 9 PM IST
            const nightTasks = await Task.countDocuments({
              userId: user._id,
              status: "completed",
              $expr: {
                $gte: [{ $hour: "$completedAt" }, 21], // 9 PM
              },
            })
            currentProgress = nightTasks
            break
        }

        // Update badge progress if it has changed
        if (currentProgress !== badge.progress) {
          badge.progress = Math.min(currentProgress, badge.target)

          if (badge.progress >= badge.target && !badge.completed) {
            badge.completed = true
            badge.earnedAt = new Date()
          }

          await badge.save()
        }

        return {
          id: badge._id.toString(),
          badgeType: badge.badgeType,
          name: badge.name,
          description: badge.description,
          rarity: badge.rarity,
          progress: badge.progress,
          target: badge.target,
          completed: badge.completed,
          earnedAt: badge.earnedAt,
          progressPercentage: Math.round((badge.progress / badge.target) * 100),
        }
      }),
    )

    // Separate completed and in-progress badges
    const completedBadges = badgeProgress.filter((badge) => badge.completed)
    const inProgressBadges = badgeProgress.filter((badge) => !badge.completed)

    return NextResponse.json(
      {
        success: true,
        data: {
          completed: completedBadges,
          inProgress: inProgressBadges,
          totalBadges: badgeProgress.length,
          completedCount: completedBadges.length,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get badge progress error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})

// Helper function to calculate current streak
async function calculateCurrentStreak(userId: string): Promise<number> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  const checkDate = new Date(today)

  while (true) {
    const dayStart = new Date(checkDate)
    const dayEnd = new Date(checkDate)
    dayEnd.setHours(23, 59, 59, 999)

    const tasksOnDay = await Task.countDocuments({
      userId,
      status: "completed",
      completedAt: { $gte: dayStart, $lte: dayEnd },
    })

    if (tasksOnDay > 0) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}
