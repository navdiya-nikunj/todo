import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import User from "@/lib/db/models/User"
import Badge from "@/lib/db/models/Badge"
import { comparePassword } from "@/lib/auth/password"
import { generateTokenPair } from "@/lib/auth/jwt"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 },
      )
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    // Update last active date
    user.stats.lastActiveDate = new Date()
    await user.save()

    // Get user badges
    const badges = await Badge.find({ userId: user._id, completed: true })

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    })

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
    }

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: {
          user: userData,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
