import mongoose, { Schema, type Document } from "mongoose"

export interface IRealm extends Document {
  _id: string
  name: string
  description: string
  theme: "fire" | "ice" | "nature" | "electric" | "shadow"
  difficulty: "easy" | "medium" | "hard" | "legendary"
  userId: mongoose.Types.ObjectId
  totalTasks: number
  completedTasks: number
  totalXPEarned: number
  createdAt: Date
  updatedAt: Date
}

const RealmSchema = new Schema<IRealm>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 200,
    },
    theme: {
      type: String,
      required: true,
      enum: ["fire", "ice", "nature", "electric", "shadow"],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard", "legendary"],
      default: "easy",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalTasks: {
      type: Number,
      default: 0,
      min: 0,
    },
    completedTasks: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalXPEarned: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
RealmSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.models.Realm || mongoose.model<IRealm>("Realm", RealmSchema)
