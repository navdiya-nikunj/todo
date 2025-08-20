import mongoose, { Schema, type Document } from "mongoose"

export interface IXPHistory extends Document {
  _id: string
  userId: mongoose.Types.ObjectId
  taskId?: mongoose.Types.ObjectId
  xpGained: number
  source: string
  description: string
  createdAt: Date
}

const XPHistorySchema = new Schema<IXPHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
    xpGained: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient queries
XPHistorySchema.index({ userId: 1, createdAt: -1 })

export default mongoose.models.XPHistory || mongoose.model<IXPHistory>("XPHistory", XPHistorySchema)
