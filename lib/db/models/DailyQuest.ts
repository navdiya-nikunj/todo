import mongoose, { Schema, type Document } from "mongoose"

export interface IDailyQuest extends Document {
  _id: string
  userId: mongoose.Types.ObjectId
  title: string
  description: string
  questType: "complete_tasks" | "visit_realms" | "earn_xp" | "maintain_streak" | "defeat_enemies" | "custom"
  target: number
  progress: number
  xpReward: number
  completed: boolean
  isCustom: boolean
  expiresAt: Date
  createdAt: Date
  updatedAt: Date
}

const DailyQuestSchema = new Schema<IDailyQuest>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    questType: {
      type: String,
      required: true,
      enum: ["complete_tasks", "visit_realms", "earn_xp", "maintain_streak", "defeat_enemies", "custom"],
    },
    target: {
      type: Number,
      required: true,
      min: 1,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
    },
    xpReward: {
      type: Number,
      required: true,
      min: 1,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    isCustom: {
      type: Boolean,
      default: false,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
DailyQuestSchema.index({ userId: 1, expiresAt: 1 })
DailyQuestSchema.index({ userId: 1, completed: 1 })

export default mongoose.models.DailyQuest || mongoose.model<IDailyQuest>("DailyQuest", DailyQuestSchema)
