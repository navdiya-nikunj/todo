import { NextResponse } from "next/server"

// Get available realm themes and their properties
export async function GET() {
  try {
    const themes = [
      {
        id: "fire",
        name: "Fire Realm",
        description: "A blazing realm of molten challenges",
        colors: {
          primary: "#FF4500",
          secondary: "#FF6B35",
          accent: "#FFD700",
        },
        difficulty: "medium",
        bonuses: {
          xpMultiplier: 1.1,
          description: "10% bonus XP for completed tasks",
        },
      },
      {
        id: "ice",
        name: "Ice Realm",
        description: "A frozen domain of crystalline trials",
        colors: {
          primary: "#00BFFF",
          secondary: "#87CEEB",
          accent: "#E0FFFF",
        },
        difficulty: "easy",
        bonuses: {
          streakProtection: true,
          description: "Streak protection on failed tasks",
        },
      },
      {
        id: "nature",
        name: "Nature Realm",
        description: "A verdant world of organic growth",
        colors: {
          primary: "#228B22",
          secondary: "#32CD32",
          accent: "#ADFF2F",
        },
        difficulty: "easy",
        bonuses: {
          healingBonus: 5,
          description: "Restore 5 XP on task completion",
        },
      },
      {
        id: "electric",
        name: "Electric Realm",
        description: "A charged atmosphere of lightning speed",
        colors: {
          primary: "#FFD700",
          secondary: "#FFFF00",
          accent: "#FFFACD",
        },
        difficulty: "hard",
        bonuses: {
          speedBonus: true,
          description: "Double XP for tasks completed within 1 hour",
        },
      },
      {
        id: "shadow",
        name: "Shadow Realm",
        description: "A mysterious domain of dark power",
        colors: {
          primary: "#4B0082",
          secondary: "#8A2BE2",
          accent: "#DDA0DD",
        },
        difficulty: "legendary",
        bonuses: {
          riskReward: 2.0,
          description: "Double XP but lose XP on failed tasks",
        },
      },
    ]

    return NextResponse.json(
      {
        success: true,
        data: themes,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Get themes error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
