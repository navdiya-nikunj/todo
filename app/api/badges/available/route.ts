import { NextResponse } from "next/server"

// Get all available badge types and their requirements
export async function GET() {
  try {
    const availableBadges = [
      {
        badgeType: "first_clear",
        name: "First Clear",
        description: "Complete your first task",
        rarity: "common",
        target: 1,
        requirement: "Complete 1 task",
        icon: "🎯",
      },
      {
        badgeType: "dungeon_master",
        name: "Dungeon Master",
        description: "Complete 100 tasks",
        rarity: "legendary",
        target: 100,
        requirement: "Complete 100 tasks",
        icon: "👑",
      },
      {
        badgeType: "streak_king",
        name: "Streak King",
        description: "Maintain a 7-day completion streak",
        rarity: "epic",
        target: 7,
        requirement: "Complete tasks for 7 consecutive days",
        icon: "🔥",
      },
      {
        badgeType: "elite_hunter",
        name: "Elite Hunter",
        description: "Reach level 10",
        rarity: "legendary",
        target: 10,
        requirement: "Reach level 10",
        icon: "⭐",
      },
      {
        badgeType: "speed_runner",
        name: "Speed Runner",
        description: "Complete 10 tasks within 1 hour of creation",
        rarity: "rare",
        target: 10,
        requirement: "Complete 10 tasks within 1 hour",
        icon: "⚡",
      },
      {
        badgeType: "perfectionist",
        name: "Perfectionist",
        description: "Maintain 100% completion rate for 30 days",
        rarity: "epic",
        target: 30,
        requirement: "100% task completion for 30 days",
        icon: "💎",
      },
      {
        badgeType: "night_watch",
        name: "Night Watch",
        description: "Complete 25 tasks after 9 PM IST",
        rarity: "rare",
        target: 25,
        requirement: "Complete 25 tasks after 9 PM",
        icon: "🌙",
      },
    ]

    return NextResponse.json(
      {
        success: true,
        data: availableBadges,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get available badges error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
