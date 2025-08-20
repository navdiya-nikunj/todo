import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import DailyQuest from "@/lib/db/models/DailyQuest"
import { withAuth } from "@/lib/auth/middleware"

export const PATCH = withAuth(async (request, { params }) => {
  try {
    await connectDB()

    const { id } = params
    const { increment = 1 } = await request.json()

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

    if (quest.completed) {
      return NextResponse.json(
        {
          success: false,
          message: "Quest is already completed",
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

    // Update progress
    quest.progress = Math.min(quest.progress + increment, quest.target)

    // Check if quest is completed
    if (quest.progress >= quest.target) {
      quest.completed = true
    }

    await quest.save()

    const questData = {
      id: quest._id.toString(),
      title: quest.title,
      description: quest.description,
      questType: quest.questType,
      target: quest.target,
      progress: quest.progress,
      xpReward: quest.xpReward,
      completed: quest.completed,
      isCustom: quest.isCustom,
      expiresAt: quest.expiresAt,
      createdAt: quest.createdAt,
    }

    return NextResponse.json(
      {
        success: true,
        message: quest.completed ? "Quest completed!" : "Progress updated",
        data: questData,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Update quest progress error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})
