import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import User from "@/lib/db/models/User"
import Realm from "@/lib/db/models/Realm"
import Task from "@/lib/db/models/Task"
import Badge from "@/lib/db/models/Badge"
import XPHistory from "@/lib/db/models/XPHistory"
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

    // Get detailed statistics
    const [realms, completedTasks, badges, recentXPHistory] = await Promise.all([
      Realm.find({ userId: user._id }),
      Task.find({ userId: user._id, status: "completed" }),
      Badge.find({ userId: user._id }),
      XPHistory.find({ userId: user._id }).sort({ createdAt: -1 }).limit(10).populate("taskId", "title"),
    ])

    // Calculate completion rate
    const totalTasks = await Task.countDocuments({ userId: user._id })
    const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0

    // Calculate XP needed for next level
    const currentLevel = user.level
    const xpForNextLevel = currentLevel * 100 + (currentLevel * (currentLevel - 1) * 100) / 2
    const xpNeeded = Math.max(0, xpForNextLevel - user.xp)

    // Get weekly XP progress (last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)

    const weeklyXP = await XPHistory.aggregate([
      {
        $match: {
          userId: user._id,
          createdAt: { $gte: weekAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalXP: { $sum: "$xpGained" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    // Calculate streak
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let streak = 0
    const checkDate = new Date(today)

    while (true) {
      const dayStart = new Date(checkDate)
      const dayEnd = new Date(checkDate)
      dayEnd.setHours(23, 59, 59, 999)

      const tasksOnDay = await Task.countDocuments({
        userId: user._id,
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

    const stats = {
      totalXP: user.xp,
      level: user.level,
      xpNeeded,
      completedTasks: completedTasks.length,
      totalTasks,
      completionRate: Math.round(completionRate * 100) / 100,
      activeRealms: realms.length,
      completedRealms: realms.filter((r) => r.completedTasks === r.totalTasks && r.totalTasks > 0).length,
      totalBadges: badges.filter((b) => b.completed).length,
      availableBadges: badges.length,
      currentStreak: streak,
      weeklyXP: weeklyXP.map((day) => ({
        date: day._id,
        xp: day.totalXP,
      })),
      recentActivity: recentXPHistory.map((history) => ({
        id: history._id.toString(),
        xpGained: history.xpGained,
        source: history.source,
        description: history.description,
        taskTitle: history.taskId?.title,
        createdAt: history.createdAt,
      })),
    }

    return NextResponse.json(
      {
        success: true,
        data: stats,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get stats error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})
