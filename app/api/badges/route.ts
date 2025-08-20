import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import Badge from "@/lib/db/models/Badge"
import { withAuth } from "@/lib/auth/middleware"

export const GET = withAuth(async (request) => {
  try {
    await connectDB()

    const badges = await Badge.find({ userId: request.user.userId }).sort({ createdAt: -1 })

    const formattedBadges = badges.map((badge) => ({
      id: badge._id.toString(),
      badgeType: badge.badgeType,
      name: badge.name,
      description: badge.description,
      rarity: badge.rarity,
      progress: badge.progress,
      target: badge.target,
      completed: badge.completed,
      earnedAt: badge.earnedAt,
      createdAt: badge.createdAt,
    }))

    return NextResponse.json(
      {
        success: true,
        data: formattedBadges,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get badges error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})
