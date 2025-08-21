import { NextResponse } from "next/server"
import connectDB from "@/lib/db/connection"
import User from "@/lib/db/models/User"
import Badge from "@/lib/db/models/Badge"
import { withAuth } from "@/lib/auth/middleware"

// Available avatars with unlock requirements and UI metadata
const AVAILABLE_AVATARS = [
  // Starter avatars
  { id: "starter-warrior", name: "Warrior", category: "starter", unlockRequirement: null, description: "A brave beginner hunter.", rarity: "common" },
  { id: "starter-mage", name: "Mage", category: "starter", unlockRequirement: null, description: "A novice of arcane arts.", rarity: "common" },
  { id: "starter-archer", name: "Archer", category: "starter", unlockRequirement: null, description: "A swift ranged fighter.", rarity: "common" },

  // Level-based avatars
  { id: "knight", name: "Knight", category: "level", unlockRequirement: { type: "level", value: 3 }, description: "Tempered by early battles.", rarity: "rare" },
  { id: "assassin", name: "Assassin", category: "level", unlockRequirement: { type: "level", value: 5 }, description: "Silent and deadly.", rarity: "epic" },
  { id: "paladin", name: "Paladin", category: "level", unlockRequirement: { type: "level", value: 7 }, description: "A holy guardian of light.", rarity: "epic" },
  { id: "shadow-lord", name: "Shadow Lord", category: "level", unlockRequirement: { type: "level", value: 10 }, description: "Master of the unseen.", rarity: "legendary" },

  // Badge-based avatars
  {
    id: "dungeon-master",
    name: "Dungeon Master",
    category: "badge",
    unlockRequirement: { type: "badge", value: "dungeon_master" },
    description: "For those who conquer many.",
    rarity: "legendary",
  },
  {
    id: "streak-king",
    name: "Streak King",
    category: "badge",
    unlockRequirement: { type: "badge", value: "elite_hunter" },
    description: "Crowned by relentless consistency.",
    rarity: "legendary",
  },
  {
    id: "elite-hunter",
    name: "Elite Hunter",
    category: "badge",
    unlockRequirement: { type: "badge", value: "elite_hunter" },
    description: "An apex hunter among hunters.",
    rarity: "legendary",
  },
]

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

    const badges = await Badge.find({ userId: user._id, completed: true })

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

      // Attach human-readable requirement text for UI
      const requirementText = avatar.unlockRequirement
        ? avatar.unlockRequirement.type === "level"
          ? `Reach level ${avatar.unlockRequirement.value}`
          : avatar.unlockRequirement.type === "badge"
            ? "Unlock required badge"
            : undefined
        : undefined

      return {
        ...avatar,
        unlockRequirement: avatar.unlockRequirement
          ? { ...avatar.unlockRequirement, requirement: requirementText }
          : null,
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
