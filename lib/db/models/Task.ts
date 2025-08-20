import mongoose, { Schema, type Document } from "mongoose"

export interface ITask extends Document {
  _id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  status: "pending" | "completed"
  realmId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  xpReward: number
  dueDate?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 500,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["easy", "medium", "hard"],
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    realmId: {
      type: Schema.Types.ObjectId,
      ref: "Realm",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    xpReward: {
      type: Number,
      required: true,
      min: 1,
    },
    dueDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Set XP reward based on difficulty
TaskSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("difficulty")) {
    switch (this.difficulty) {
      case "easy":
        this.xpReward = 10
        break
      case "medium":
        this.xpReward = 25
        break
      case "hard":
        this.xpReward = 50
        break
    }
  }
  next()
})

// Index for efficient queries
TaskSchema.index({ realmId: 1, status: 1 })
TaskSchema.index({ userId: 1, createdAt: -1 })

export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema)
