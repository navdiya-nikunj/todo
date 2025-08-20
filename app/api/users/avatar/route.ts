import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import User from "@/lib/db/models/User"
import Badge from "@/lib/db/models/Badge"
import { withAuth } from "@/lib/auth/middleware"

// Available avatars with unlock requirements
const AVAILABLE_AVATARS = [
  // Starter avatars
  { id: "starter-warrior", name: "Warrior", category: "starter", unlockRequirement: null },
  { id: "starter-mage", name: "Mage", category: "starter", unlockRequirement: null },
  { id: "starter-archer", name: "Archer", category: "starter", unlockRequirement: null },

  // Level-based avatars
  { id: "knight", name: "Knight", category: "level", unlockRequirement: { type: "level", value: 3 } },
  { id: "assassin", name: "Assassin", category: "level", unlockRequirement: { type: "level", value: 5 } },
  { id: "paladin", name: "Paladin", category: "level", unlockRequirement: { type: "level", value: 7 } },
  { id: "shadow-lord", name: "Shadow Lord", category: "level", unlockRequirement: { type: "level", value: 10 } },

  // Badge-based avatars
  {
    id: "dungeon-master",
    name: "Dungeon Master",
    category: "badge",
    unlockRequirement: { type: "badge", value: "dungeon_master" },
  },
  {
    id: "streak-king",
    name: "Streak King",
    category: "badge",
    unlockRequirement: { type: "badge", value: "streak_king" },
  },
  {
    id: "elite-hunter",
    name: "Elite Hunter",
    category: "badge",
    unlockRequirement: { type: "badge", value: "elite_hunter" },
  },
]

export const GET = withAuth(async (request) => {
  try {
    await connectDB()

    const user = await User.findById(request.user.userId)
    const badges = await Badge.find({ userId: user._id, completed: true })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      )
    }

    const userBadgeTypes = badges.map((badge) => badge.badgeType)

    // Check which avatars are unlocked
    const avatarsWithStatus = AVAILABLE_AVATARS.map((avatar) => {
      let unlocked = true

      if (avatar.unlockRequirement) {
        if (avatar.unlockRequirement.type === "level") {
          unlocked = user.level >= avatar.unlockRequirement.value
        } else if (avatar.unlockRequirement.type === "badge") {
          unlocked = userBadgeTypes.includes(avatar.unlockRequirement.value)
        }
      }

      return {
        ...avatar,
        unlocked,
        selected: user.avatar === avatar.id,
      }
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          currentAvatar: user.avatar,
          avatars: avatarsWithStatus,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get avatars error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})

export const PATCH = withAuth(async (request) => {
  try {
    await connectDB()

    const { avatarId } = await request.json()

    if (!avatarId) {
      return NextResponse.json(
        {
          success: false,
          message: "Avatar ID is required",
        },
        { status: 400 },
      )
    }

    const user = await User.findById(request.user.userId)
    const badges = await Badge.find({ userId: user._id, completed: true })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      )
    }

    // Check if avatar exists and is unlocked
    const avatar = AVAILABLE_AVATARS.find((a) => a.id === avatarId)

    if (!avatar) {
      return NextResponse.json(
        {
          success: false,
          message: "Avatar not found",
        },
        { status: 404 },
      )
    }

    // Check unlock requirements
    if (avatar.unlockRequirement) {
      const userBadgeTypes = badges.map((badge) => badge.badgeType)

      if (avatar.unlockRequirement.type === "level" && user.level < avatar.unlockRequirement.value) {
        return NextResponse.json(
          {
            success: false,
            message: `Avatar requires level ${avatar.unlockRequirement.value}`,
          },
          { status: 403 },
        )
      }

      if (avatar.unlockRequirement.type === "badge" && !userBadgeTypes.includes(avatar.unlockRequirement.value)) {
        return NextResponse.json(
          {
            success: false,
            message: "Avatar requires specific badge achievement",
          },
          { status: 403 },
        )
      }
    }

    // Update user avatar
    user.avatar = avatarId
    await user.save()

    return NextResponse.json(
      {
        success: true,
        message: "Avatar updated successfully",
        data: {
          avatar: avatarId,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Update avatar error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
})
