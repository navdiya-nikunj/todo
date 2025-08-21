import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import DailyQuest from "@/lib/db/models/DailyQuest"
import User from "@/lib/db/models/User"
import XPHistory from "@/lib/db/models/XPHistory"
import { withAuth } from "@/lib/auth/middleware"

export const POST = withAuth(async (request, { params }) => {
  try {
    await connectDB()

    const { id } = await params

    const quest = await DailyQuest.findOne({
      _id: id,
      userId: request.user.userId,
    })

    if (!quest) {
      return NextResponse.json(
        {
          success: false,
          message: "Daily quest not found",
        },
        { status: 404 },
      )
    }

    if (!quest.completed) {
      return NextResponse.json(
        {
          success: false,
          message: "Quest is not completed yet",
        },
        { status: 400 },
      )
    }

    if (quest.expiresAt < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "Quest has expired",
        },
        { status: 400 },
      )
    }

    // Check if already claimed (we'll add a claimed field)
    if (quest.progress === -1) {
      // Using -1 as a marker for claimed quests
      return NextResponse.json(
        {
          success: false,
          message: "Quest reward already claimed",
        },
        { status: 400 },
      )
    }

    // Award XP to user
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

    const previousLevel = user.level
    user.xp += quest.xpReward
    user.stats.totalXP += quest.xpReward
    await user.save()

    // Check for level up
    const newLevel = user.calculateLevel()
    const leveledUp = newLevel > previousLevel

    if (leveledUp) {
      user.level = newLevel
      await user.save()
    }

    // Record XP history
    const xpHistory = new XPHistory({
      userId: user._id,
      xpGained: quest.xpReward,
      source: "daily_quest",
      description: `Completed daily quest: ${quest.title}`,
    })
    await xpHistory.save()

    // Mark quest as claimed
    quest.progress = -1 // Marker for claimed
    await quest.save()

    return NextResponse.json(
      {
        success: true,
        message: "Quest reward claimed successfully!",
        data: {
          xpGained: quest.xpReward,
          levelUp: leveledUp ? { from: previousLevel, to: newLevel } : null,
          userStats: {
            level: user.level,
            xp: user.xp,
          },
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Claim quest reward error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})
