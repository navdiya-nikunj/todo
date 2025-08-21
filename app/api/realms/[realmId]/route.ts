import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Realm from "@/lib/db/models/Realm"
import Task from "@/lib/db/models/Task"
import User from "@/lib/db/models/User"
import { withAuth } from "@/lib/auth/middleware"

export const GET = withAuth(async (request, { params }: { params: { realmId: string } }) => {
  try {
    await connectDB()
    console.log("params", params)
    const { realmId } = params

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

    // Get realm tasks
    const tasks = await Task.find({ realmId: realmId }).sort({ createdAt: -1 })

    const realmData = {
      id: realm._id.toString(),
      name: realm.name,
      description: realm.description,
      theme: realm.theme,
      difficulty: realm.difficulty,
      totalTasks: realm.totalTasks,
      completedTasks: realm.completedTasks,
      totalXPEarned: realm.totalXPEarned,
      completionRate: realm.totalTasks > 0 ? (realm.completedTasks / realm.totalTasks) * 100 : 0,
      tasks: tasks.map((task) => ({
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
      })),
      createdAt: realm.createdAt,
      updatedAt: realm.updatedAt,
    }

    return NextResponse.json(
      {
        success: true,
        data: realmData,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get realm error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})

export const PATCH = withAuth(async (request, { params }) => {
  try {
    await connectDB()

    const { realmId } = params
    const { name, description, theme, difficulty } = await request.json()

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

    // Update fields if provided
    if (name) realm.name = name.trim()
    if (description) realm.description = description.trim()

    if (theme) {
      const validThemes = ["fire", "ice", "nature", "electric", "shadow"]
      if (!validThemes.includes(theme)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid theme",
          },
          { status: 400 },
        )
      }
      realm.theme = theme
    }

    if (difficulty) {
      const validDifficulties = ["easy", "medium", "hard", "legendary"]
      if (!validDifficulties.includes(difficulty)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid difficulty",
          },
          { status: 400 },
        )
      }
      realm.difficulty = difficulty
    }

    await realm.save()

    const realmData = {
      id: realm._id.toString(),
      name: realm.name,
      description: realm.description,
      theme: realm.theme,
      difficulty: realm.difficulty,
      totalTasks: realm.totalTasks,
      completedTasks: realm.completedTasks,
      totalXPEarned: realm.totalXPEarned,
      completionRate: realm.totalTasks > 0 ? (realm.completedTasks / realm.totalTasks) * 100 : 0,
      createdAt: realm.createdAt,
      updatedAt: realm.updatedAt,
    }

    return NextResponse.json(
      {
        success: true,
        message: "Realm updated successfully",
        data: realmData,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Update realm error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})

export const DELETE = withAuth(async (request, { params }) => {
  try {
    await connectDB()

    const { realmId } = params

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

    // Delete all tasks in the realm
    await Task.deleteMany({ realmId: realmId })

    // Delete the realm
    await Realm.findByIdAndDelete(realmId)

    // Update user's active realms count
    await User.findByIdAndUpdate(request.user.userId, {
      $inc: { "stats.activeRealms": -1 },
    })

    return NextResponse.json(
      {
        success: true,
        message: "Realm deleted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Delete realm error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})
