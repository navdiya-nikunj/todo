import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Realm from "@/lib/db/models/Realm"
import Task from "@/lib/db/models/Task"
import User from "@/lib/db/models/User"
import XPHistory from "@/lib/db/models/XPHistory"
import { withAuth } from "@/lib/auth/middleware"

export const POST = withAuth(async (request, { params }) => {
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

    if (task.status !== "completed") {
      return NextResponse.json(
        {
          success: false,
          message: "Task is not completed",
        },
        { status: 400 },
      )
    }

    // Get the XP history entry for this task completion
    const xpHistory = await XPHistory.findOne({
      taskId: task._id,
      userId: request.user.userId,
      source: "task_completion",
    }).sort({ createdAt: -1 })

    if (!xpHistory) {
      return NextResponse.json(
        {
          success: false,
          message: "XP history not found for this task",
        },
        { status: 404 },
      )
    }

    // Mark task as pending
    task.status = "pending"
    task.completedAt = undefined
    await task.save()

    // Update user XP and stats (subtract the XP that was gained)
    const user = await User.findById(request.user.userId)
    if (user) {
      user.xp = Math.max(0, user.xp - xpHistory.xpGained)
      user.stats.totalXP = Math.max(0, user.stats.totalXP - xpHistory.xpGained)
      user.stats.tasksCompleted = Math.max(0, user.stats.tasksCompleted - 1)

      // Recalculate level
      user.level = user.calculateLevel()
      await user.save()
    }

    // Update realm stats
    await Realm.findByIdAndUpdate(realmId, {
      $inc: {
        completedTasks: -1,
        totalXPEarned: -xpHistory.xpGained,
      },
    })

    // Remove the XP history entry
    await XPHistory.findByIdAndDelete(xpHistory._id)

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

    return NextResponse.json(
      {
        success: true,
        message: "Task marked as incomplete",
        data: {
          task: taskData,
          xpLost: xpHistory.xpGained,
          userStats: {
            level: user?.level,
            xp: user?.xp,
            tasksCompleted: user?.stats.tasksCompleted,
          },
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Uncomplete task error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})
