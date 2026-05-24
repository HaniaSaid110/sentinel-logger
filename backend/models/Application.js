import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Application name is required"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: (value) => !/\s/.test(value),
      message: "Application name must not contain whitespace",
    },
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Developer",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;
