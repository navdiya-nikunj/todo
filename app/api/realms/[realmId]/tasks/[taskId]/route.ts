import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Realm from "@/lib/db/models/Realm"
import Task from "@/lib/db/models/Task"
import { withAuth } from "@/lib/auth/middleware"
import { getXPRewardForDifficulty } from "@/lib/utils/xp"

export const GET = withAuth(async (request, { params }) => {
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
        data: taskData,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get task error:", error)
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

    const { realmId, taskId } = params
    const { title, description, difficulty, dueDate } = await request.json()

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

    // Don't allow editing completed tasks
    if (task.status === "completed") {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot edit completed tasks",
        },
        { status: 400 },
      )
    }

    // Update fields if provided
    if (title) task.title = title.trim()
    if (description) task.description = description.trim()

    if (difficulty) {
      const validDifficulties = ["easy", "medium", "hard"]
      if (!validDifficulties.includes(difficulty)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid difficulty",
          },
          { status: 400 },
        )
      }
      task.difficulty = difficulty
      task.xpReward = getXPRewardForDifficulty(difficulty)
    }

    if (dueDate !== undefined) {
      if (dueDate && new Date(dueDate) < new Date()) {
        return NextResponse.json(
          {
            success: false,
            message: "Due date cannot be in the past",
          },
          { status: 400 },
        )
      }
      task.dueDate = dueDate ? new Date(dueDate) : undefined
    }

    await task.save()

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
        message: "Task updated successfully",
        data: taskData,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Update task error:", error)
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

    // Delete the task
    await Task.findByIdAndDelete(taskId)

    // Update realm's task counts
    const updateData: any = { $inc: { totalTasks: -1 } }
    if (task.status === "completed") {
      updateData.$inc.completedTasks = -1
      updateData.$inc.totalXPEarned = -task.xpReward
    }

    await Realm.findByIdAndUpdate(realmId, updateData)

    return NextResponse.json(
      {
        success: true,
        message: "Task deleted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Delete task error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})
