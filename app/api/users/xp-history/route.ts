import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import XPHistory from "@/lib/db/models/XPHistory"
import { withAuth } from "@/lib/auth/middleware"

export const GET = withAuth(async (request) => {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // Calculate date range
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get XP history with pagination
    const [history, total] = await Promise.all([
      XPHistory.find({
        userId: request.user.userId,
        createdAt: { $gte: startDate },
      })
        .populate("taskId", "title difficulty")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      XPHistory.countDocuments({
        userId: request.user.userId,
        createdAt: { $gte: startDate },
      }),
    ])

    // Get daily XP aggregation
    const dailyXP = await XPHistory.aggregate([
      {
        $match: {
          userId: request.user.userId,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalXP: { $sum: "$xpGained" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])

    const formattedHistory = history.map((entry) => ({
      id: entry._id.toString(),
      xpGained: entry.xpGained,
      source: entry.source,
      description: entry.description,
      taskTitle: entry.taskId?.title,
      taskDifficulty: entry.taskId?.difficulty,
      createdAt: entry.createdAt,
    }))

    return NextResponse.json(
      {
        success: true,
        data: {
          history: formattedHistory,
          dailyXP: dailyXP.map((day) => ({
            date: day._id,
            xp: day.totalXP,
            activities: day.count,
          })),
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get XP history error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})
