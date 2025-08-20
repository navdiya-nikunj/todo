import mongoose, { Schema, type Document } from "mongoose"

export interface IBadge extends Document {
  _id: string
  userId: mongoose.Types.ObjectId
  badgeType: string
  name: string
  description: string
  rarity: "common" | "rare" | "epic" | "legendary"
  progress: number
  target: number
  completed: boolean
  earnedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const BadgeSchema = new Schema<IBadge>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    badgeType: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rarity: {
      type: String,
      enum: ["common", "rare", "epic", "legendary"],
      default: "common",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
    },
    target: {
      type: Number,
      required: true,
      min: 1,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    earnedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
BadgeSchema.index({ userId: 1, completed: 1 })
BadgeSchema.index({ userId: 1, badgeType: 1 }, { unique: true })

export default mongoose.models.Badge || mongoose.model<IBadge>("Badge", BadgeSchema)
