import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const developerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false, // never return password in queries by default
  },
  apiKey: {
    type: String,
    unique: true,
    default: () => crypto.randomUUID(),
  },
});

// ─── Hash password before saving ─────────────────────────────────────────────
developerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── Instance method: compare plain password with hashed ─────────────────────
developerSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const Developer = mongoose.model("Developer", developerSchema);
export default Developer;
