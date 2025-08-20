import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth/middleware"

export const POST = withAuth(async (request) => {
  try {
    // In a more complex setup, you might want to blacklist the token
    // For now, we'll just return success as the client will remove the token

    return NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})
