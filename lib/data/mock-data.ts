import type { UserProfile, Realm, Task, AvatarOption, Badge } from "@/lib/types/realm-quest"

export const mockUser: UserProfile = {
  id: "user1",
  name: "Hunter",
  email: "hunter@example.com",
  level: 5,
  xp: 1250,
  badges: [
    { id: "first_clear", name: "First Clear" },
    { id: "streak_king", name: "Streak King" },
  ],
  stats: {
    tasksCompleted: 25,
    realmsCleared: 3,
  },
  avatar: "/anime-warrior-avatar.png",
}

export const mockRealms: Realm[] = [
  {
    id: "realm1",
    name: "Forest of Shadows",
    description: "A dark and mysterious forest filled with dangers.",
    theme: "nature",
    tasksCompleted: 8,
    totalTasks: 12,
    difficulty: "medium",
  },
  {
    id: "realm2",
    name: "Mountain of Trials",
    description: "A challenging mountain range with difficult quests.",
    theme: "fire",
    tasksCompleted: 5,
    totalTasks: 8,
    difficulty: "hard",
  },
  {
    id: "realm3",
    name: "Crystal Caverns",
    description: "Mystical caves filled with magical crystals.",
    theme: "ice",
    tasksCompleted: 12,
    totalTasks: 12,
    difficulty: "easy",
  },
  {
    id: "realm4",
    name: "Thunder Plains",
    description: "Electrifying plains where lightning never stops.",
    theme: "electric",
    tasksCompleted: 0,
    totalTasks: 15,
    difficulty: "hard",
  },
  {
    id: "realm5",
    name: "Shadow Realm",
    description: "The darkest realm where nightmares come alive.",
    theme: "shadow",
    tasksCompleted: 3,
    totalTasks: 20,
    difficulty: "legendary",
  },
]

export const mockTasks: Task[] = [
  {
    id: "task1",
    title: "Defeat the Shadow Beast",
    description: "Find and defeat the elusive Shadow Beast.",
    difficulty: "hard",
    status: "pending",
    realmId: "realm1",
  },
  {
    id: "task2",
    title: "Collect 100 Shrooms",
    description: "Gather 100 rare shrooms in the Forest of Shadows.",
    difficulty: "easy",
    status: "pending",
    realmId: "realm1",
  },
  {
    id: "task3",
    title: "Scale the Fire Peak",
    description: "Reach the summit of the burning mountain.",
    difficulty: "medium",
    status: "completed",
    realmId: "realm2",
  },
]

export const availableAvatars: AvatarOption[] = [
  {
    id: "starter_warrior",
    name: "Shadow Warrior",
    image: "/anime-warrior-avatar.png",
    category: "starter",
    description: "The classic hunter avatar for new adventurers",
    rarity: "common",
  },
  {
    id: "starter_mage",
    name: "Mystic Mage",
    image: "/placeholder-qras5.png",
    category: "starter",
    description: "A wise spellcaster ready for magical quests",
    rarity: "common",
  },
  {
    id: "starter_archer",
    name: "Swift Archer",
    image: "/placeholder-9hzgv.png",
    category: "starter",
    description: "A nimble ranger with keen eyes and steady aim",
    rarity: "common",
  },
  {
    id: "level_5_knight",
    name: "Royal Knight",
    image: "/placeholder-bb8as.png",
    category: "level",
    unlockRequirement: { type: "level", value: 5 },
    description: "A noble knight in shining golden armor",
    rarity: "rare",
  },
  {
    id: "level_10_assassin",
    name: "Shadow Assassin",
    image: "/placeholder-d1ptd.png",
    category: "level",
    unlockRequirement: { type: "level", value: 10 },
    description: "A master of stealth and precision strikes",
    rarity: "epic",
  },
  {
    id: "badge_dungeon_master",
    name: "Dungeon Master",
    image: "/placeholder-x546j.png",
    category: "badge",
    unlockRequirement: { type: "badge", value: "dungeon_master" },
    description: "Exclusive avatar for completing 100 tasks",
    rarity: "legendary",
  },
]

export const availableBadges: Badge[] = [
  { id: "first_clear", name: "First Clear" },
  { id: "dungeon_master", name: "Dungeon Master" },
  { id: "streak_king", name: "Streak King" },
  { id: "night_watch", name: "Night Watch" },
]
