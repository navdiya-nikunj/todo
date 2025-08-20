import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import User from "@/lib/db/models/User"
import { verifyRefreshToken, generateTokenPair } from "@/lib/auth/jwt"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { refreshToken } = await request.json()

    if (!refreshToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token is required",
        },
        { status: 400 },
      )
    }

    // Verify refresh token
    let payload
    try {
      payload = verifyRefreshToken(refreshToken)
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired refresh token",
        },
        { status: 401 },
      )
    }

    // Find user
    const user = await User.findById(payload.userId)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      )
    }

    // Generate new tokens
    const tokens = generateTokenPair({
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Tokens refreshed successfully",
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Token refresh error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
