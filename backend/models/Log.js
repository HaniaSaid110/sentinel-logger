import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Log message is required"],
      trim: true,
    },
    level: {
      type: String,
      enum: {
        values: ["INFO", "WARN", "ERROR"],
        message: "Level must be INFO, WARN, or ERROR",
      },
      required: [true, "Log level is required"],
    },
    count: {
      type: Number,
      default: 1,
      min: 1,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
  },
  {
    // Mongoose automatically manages createdAt and updatedAt
    timestamps: true,
  }
);

// ─── Compound index: fast upsert lookups by app + message + level ─────────────
logSchema.index({ applicationId: 1, message: 1, level: 1 });

const Log = mongoose.model("Log", logSchema);
export default Log;
