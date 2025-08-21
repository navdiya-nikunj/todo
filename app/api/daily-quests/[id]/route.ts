import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import DailyQuest from "@/lib/db/models/DailyQuest"
import { withAuth } from "@/lib/auth/middleware"

// Update custom daily quest
export const PATCH = withAuth(async (request, { params }) => {
  try {
    await connectDB()

    const { id } = params
    const { title, description, target, xpReward } = await request.json()

    // Validate required fields
    if (!title || !description || !target || !xpReward) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, description, target, and XP reward are required",
        },
        { status: 400 },
      )
    }

    // Validate values
    if (target < 1 || target > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Target must be between 1 and 100",
        },
        { status: 400 },
      )
    }

    if (xpReward < 1 || xpReward > 200) {
      return NextResponse.json(
        {
          success: false,
          message: "XP reward must be between 1 and 200",
        },
        { status: 400 },
      )
    }

    // Find and update the custom daily quest
    const quest = await DailyQuest.findOne({
      _id: id,
      userId: request.user.userId,
      isCustom: true,
    })

    if (!quest) {
      return NextResponse.json(
        {
          success: false,
          message: "Custom daily quest not found or access denied",
        },
        { status: 404 },
      )
    }

    // Check if quest is already completed
    if (quest.completed) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot edit completed quests",
        },
        { status: 400 },
      )
    }

    // Update quest fields
    quest.title = title.trim()
    quest.description = description.trim()
    quest.target = target
    quest.xpReward = xpReward
    quest.updatedAt = new Date()

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
      updatedAt: quest.updatedAt,
    }

    return NextResponse.json(
      {
        success: true,
        message: "Custom daily quest updated successfully",
        data: questData,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Update daily quest error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})

// Delete custom daily quest
export const DELETE = withAuth(async (request, { params }) => {
  try {
    await connectDB()

    const { id } = params

    // Find the custom daily quest
    const quest = await DailyQuest.findOne({
      _id: id,
      userId: request.user.userId,
      isCustom: true,
    })

    if (!quest) {
      return NextResponse.json(
        {
          success: false,
          message: "Custom daily quest not found or access denied",
        },
        { status: 404 },
      )
    }

    // Check if quest is already completed
    if (quest.completed) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot delete completed quests",
        },
        { status: 400 },
      )
    }

    // Delete the quest
    await DailyQuest.findByIdAndDelete(id)

    return NextResponse.json(
      {
        success: true,
        message: "Custom daily quest deleted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Delete daily quest error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})
