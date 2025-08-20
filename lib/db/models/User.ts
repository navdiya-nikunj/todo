import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  _id: string
  username: string
  email: string
  password: string
  level: number
  xp: number
  avatar?: string
  badges: string[]
  stats: {
    tasksCompleted: number
    realmsCleared: number
    streak: number
    totalXP: number
    activeRealms: number
    lastActiveDate?: Date
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    avatar: {
      type: String,
      default: "starter-warrior",
    },
    badges: [
      {
        type: String,
      },
    ],
    stats: {
      tasksCompleted: { type: Number, default: 0 },
      realmsCleared: { type: Number, default: 0 },
      streak: { type: Number, default: 0 },
      totalXP: { type: Number, default: 0 },
      activeRealms: { type: Number, default: 0 },
      lastActiveDate: { type: Date },
    },
  },
  {
    timestamps: true,
  },
)

// Calculate level from XP
UserSchema.methods.calculateLevel = function () {
  const xp = this.xp
  let level = 1
  let requiredXP = 0

  while (requiredXP <= xp) {
    level++
    requiredXP += (level - 1) * 100
  }

  return level - 1
}

// Update level when XP changes
UserSchema.pre("save", function (next) {
  if (this.isModified("xp")) {
    this.level = this.calculateLevel()
    this.stats.totalXP = this.xp
  }
  next()
})

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
