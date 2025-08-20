import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Realm from "@/lib/db/models/Realm"
import User from "@/lib/db/models/User"
import { withAuth } from "@/lib/auth/middleware"

export const GET = withAuth(async (request) => {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const theme = searchParams.get("theme")
    const difficulty = searchParams.get("difficulty")
    const search = searchParams.get("search")

    // Build filter query
    const filter: any = { userId: request.user.userId }

    if (theme) {
      filter.theme = theme
    }

    if (difficulty) {
      filter.difficulty = difficulty
    }

    if (search) {
      filter.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    }

    // Get realms with pagination
    const [realms, total] = await Promise.all([
      Realm.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Realm.countDocuments(filter),
    ])

    const formattedRealms = realms.map((realm) => ({
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
    }))

    return NextResponse.json(
      {
        success: true,
        data: formattedRealms,
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
    console.error("Get realms error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})

export const POST = withAuth(async (request) => {
  try {
    await connectDB()

    const { name, description, theme, difficulty } = await request.json()

    // Validate required fields
    if (!name || !description || !theme) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, description, and theme are required",
        },
        { status: 400 },
      )
    }

    // Validate theme
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

    // Validate difficulty
    const validDifficulties = ["easy", "medium", "hard", "legendary"]
    if (difficulty && !validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid difficulty",
        },
        { status: 400 },
      )
    }

    // Create new realm
    const realm = new Realm({
      name: name.trim(),
      description: description.trim(),
      theme,
      difficulty: difficulty || "easy",
      userId: request.user.userId,
      totalTasks: 0,
      completedTasks: 0,
      totalXPEarned: 0,
    })

    await realm.save()

    // Update user's active realms count
    await User.findByIdAndUpdate(request.user.userId, {
      $inc: { "stats.activeRealms": 1 },
    })

    const realmData = {
      id: realm._id.toString(),
      name: realm.name,
      description: realm.description,
      theme: realm.theme,
      difficulty: realm.difficulty,
      totalTasks: realm.totalTasks,
      completedTasks: realm.completedTasks,
      totalXPEarned: realm.totalXPEarned,
      completionRate: 0,
      createdAt: realm.createdAt,
      updatedAt: realm.updatedAt,
    }

    return NextResponse.json(
      {
        success: true,
        message: "Realm created successfully",
        data: realmData,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create realm error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})
