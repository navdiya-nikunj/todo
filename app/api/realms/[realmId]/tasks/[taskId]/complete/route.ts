import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Realm from "@/lib/db/models/Realm"
import Task from "@/lib/db/models/Task"
import User from "@/lib/db/models/User"
import XPHistory from "@/lib/db/models/XPHistory"
import { withAuth } from "@/lib/auth/middleware"
import { calculateStreakMultiplier } from "@/lib/utils/xp"
import { checkAndAwardBadges } from "@/lib/utils/badges"

export const POST = withAuth(async (request, { params }: { params: { realmId: string; taskId: string } }) => {
  try {
    await connectDB()

    const { realmId, taskId } = params

    // Verify realm ownership
    const realm = await Realm.findOne({
      _id: realmId,
      userId: request.user.userId,
    })

    if (!realm) {
      return NextResponse.json(
        {
          success: false,
          message: "Realm not found",
        },
        { status: 404 },
      )
    }

    const task = await Task.findOne({
      _id: taskId,
      realmId,
      userId: request.user.userId,
    })

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 },
      )
    }

    if (task.status === "completed") {
      return NextResponse.json(
        {
          success: false,
          message: "Task is already completed",
        },
        { status: 400 },
      )
    }

    // Get user for streak calculation
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

    // Calculate current streak
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    let currentStreak = user.stats.streak || 0

    // Check if user completed tasks yesterday to maintain streak
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayEnd = new Date(yesterday)
    yesterdayEnd.setHours(23, 59, 59, 999)

    const tasksYesterday = await Task.countDocuments({
      userId: user._id,
      status: "completed",
      completedAt: { $gte: yesterday, $lte: yesterdayEnd },
    })

    // Check if user already completed tasks today
    const todayEnd = new Date(today)
    todayEnd.setHours(23, 59, 59, 999)

    const tasksToday = await Task.countDocuments({
      userId: user._id,
      status: "completed",
      completedAt: { $gte: today, $lte: todayEnd },
    })

    // Update streak
    if (tasksToday === 0) {
      // First task today
      if (tasksYesterday > 0) {
        currentStreak += 1
      } else {
        currentStreak = 1 // Reset streak
      }
    }

    // Calculate XP with streak multiplier
    const baseXP = task.xpReward
    const streakMultiplier = calculateStreakMultiplier(currentStreak)
    const finalXP = Math.round(baseXP * streakMultiplier)

    // Mark task as completed
    task.status = "completed"
    task.completedAt = new Date()
    await task.save()

    // Update user XP and stats
    const previousLevel = user.level
    user.xp += finalXP
    user.stats.totalXP += finalXP
    user.stats.tasksCompleted += 1
    user.stats.streak = currentStreak
    user.stats.lastActiveDate = new Date()
    await user.save()

    // Check for level up
    const newLevel = user.calculateLevel()
    const leveledUp = newLevel > previousLevel

    if (leveledUp) {
      user.level = newLevel
      await user.save()
    }

    // Update realm stats
    await Realm.findByIdAndUpdate(realmId, {
      $inc: {
        completedTasks: 1,
        totalXPEarned: finalXP,
      },
    })

    // Record XP history
    const xpHistory = new XPHistory({
      userId: user._id,
      taskId: task._id,
      xpGained: finalXP,
      source: "task_completion",
      description: `Completed task: ${task.title}`,
    })
    await xpHistory.save()

    // Check and award badges
    const newBadges = await checkAndAwardBadges(user._id.toString(), {
      tasksCompleted: user.stats.tasksCompleted,
      currentStreak,
      totalXP: user.xp,
      level: user.level,
    })

    // Format response
    const taskData = {
      id: task._id.toString(),
      title: task.title,
      description: task.description,
      difficulty: task.difficulty,
      status: task.status,
      xpReward: task.xpReward,
      dueDate: task.dueDate,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }

    const response = {
      success: true,
      message: "Task completed successfully!",
      data: {
        task: taskData,
        xpGained: finalXP,
        baseXP,
        streakMultiplier,
        currentStreak,
        levelUp: leveledUp ? { from: previousLevel, to: newLevel } : null,
        newBadges: newBadges.map((badge) => ({
          id: badge._id.toString(),
          name: badge.name,
          description: badge.description,
          rarity: badge.rarity,
        })),
        userStats: {
          level: user.level,
          xp: user.xp,
          tasksCompleted: user.stats.tasksCompleted,
          streak: currentStreak,
        },
      },
    }

    return NextResponse.json(response, { status: 200 })
  } catch (error) {
    console.error("Complete task error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})
