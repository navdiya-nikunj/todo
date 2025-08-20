import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Realm from "@/lib/db/models/Realm"
import Task from "@/lib/db/models/Task"
import { withAuth } from "@/lib/auth/middleware"
import { getXPRewardForDifficulty } from "@/lib/utils/xp"

export const GET = withAuth(async (request, { params }) => {
  try {
    await connectDB()

    const { realmId } = params
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const difficulty = searchParams.get("difficulty")
    const search = searchParams.get("search")

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

    // Build filter query
    const filter: any = { realmId, userId: request.user.userId }

    if (status) {
      filter.status = status
    }

    if (difficulty) {
      filter.difficulty = difficulty
    }

    if (search) {
      filter.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Get tasks with pagination
    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Task.countDocuments(filter),
    ])

    const formattedTasks = tasks.map((task) => ({
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
    }))

    return NextResponse.json(
      {
        success: true,
        data: formattedTasks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get tasks error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})

export const POST = withAuth(async (request, { params }) => {
  try {
    await connectDB()

    const { realmId } = params
    const { title, description, difficulty, dueDate } = await request.json()

    // Validate required fields
    if (!title || !description || !difficulty) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, description, and difficulty are required",
        },
        { status: 400 },
      )
    }

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

    // Validate difficulty
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

    // Validate due date if provided
    if (dueDate && new Date(dueDate) < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: "Due date cannot be in the past",
        },
        { status: 400 },
      )
    }

    // Create new task
    const task = new Task({
      title: title.trim(),
      description: description.trim(),
      difficulty,
      realmId,
      userId: request.user.userId,
      xpReward: getXPRewardForDifficulty(difficulty),
      dueDate: dueDate ? new Date(dueDate) : undefined,
    })

    await task.save()

    // Update realm's total tasks count
    await Realm.findByIdAndUpdate(realmId, {
      $inc: { totalTasks: 1 },
    })

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
        message: "Task created successfully",
        data: taskData,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create task error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})
