import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import User from "@/lib/db/models/User"
import Badge from "@/lib/db/models/Badge"
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

    // Get user badges
    const badges = await Badge.find({ userId: user._id, completed: true })

    // Return user data without password
    const userData = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      level: user.level,
      xp: user.xp,
      avatar: user.avatar,
      badges: badges.map((badge) => ({
        id: badge._id.toString(),
        name: badge.name,
        description: badge.description,
        rarity: badge.rarity,
        unlockedAt: badge.earnedAt,
      })),
      stats: user.stats,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return NextResponse.json(
      {
        success: true,
        data: userData,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})
