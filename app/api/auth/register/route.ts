import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import User from "@/lib/db/models/User"
import Badge from "@/lib/db/models/Badge"
import { hashPassword, validatePassword } from "@/lib/auth/password"
import { generateTokenPair } from "@/lib/auth/jwt"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { username, email, password } = await request.json()

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username, email, and password are required",
        },
        { status: 400 },
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Password does not meet requirements",
          errors: passwordValidation.errors,
        },
        { status: 400 },
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: existingUser.email === email.toLowerCase() ? "Email already registered" : "Username already taken",
        },
        { status: 409 },
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create new user
    const user = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      level: 1,
      xp: 0,
      avatar: "starter-warrior",
      badges: [],
      stats: {
        tasksCompleted: 0,
        realmsCleared: 0,
        streak: 0,
        totalXP: 0,
        activeRealms: 0,
      },
    })

    await user.save()

    // Create initial badges for the user
    const initialBadges = [
      {
        userId: user._id,
        badgeType: "first_clear",
        name: "First Clear",
        description: "Complete your first task",
        rarity: "common" as const,
        progress: 0,
        target: 1,
      },
      {
        userId: user._id,
        badgeType: "dungeon_master",
        name: "Dungeon Master",
        description: "Complete 100 tasks",
        rarity: "legendary" as const,
        progress: 0,
        target: 100,
      },
      {
        userId: user._id,
        badgeType: "streak_king",
        name: "Streak King",
        description: "Maintain a 7-day completion streak",
        rarity: "epic" as const,
        progress: 0,
        target: 7,
      },
    ]

    await Badge.insertMany(initialBadges)

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
      badges: [],
      stats: user.stats,
      createdAt: user.createdAt,
    }

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: {
          user: userData,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
