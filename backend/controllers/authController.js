import jwt from "jsonwebtoken";
import Developer from "../models/Developer.js";

// ─── Helper: sign a JWT and set it as an httpOnly cookie ─────────────────────
const sendTokenCookie = (res, developer) => {
  const token = jwt.sign({ id: developer._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  return token;
};

// ─── POST /api/users/register ─────────────────────────────────────────────────
export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existing = await Developer.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const developer = await Developer.create({ username, email, password });
    sendTokenCookie(res, developer);

    res.status(201).json({
      message: "Registration successful",
      developer: {
        id: developer._id,
        username: developer.username,
        email: developer.email,
        apiKey: developer.apiKey,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/users/login ────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Explicitly select password since it is excluded by default
    const developer = await Developer.findOne({ email }).select("+password");
    if (!developer || !(await developer.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    sendTokenCookie(res, developer);

    res.status(200).json({
      message: "Login successful",
      developer: {
        id: developer._id,
        username: developer.username,
        email: developer.email,
        apiKey: developer.apiKey,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/users/logout ───────────────────────────────────────────────────
export const logout = (_req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

// ─── GET /api/users/me ────────────────────────────────────────────────────────
export const getMe = (req, res) => {
  res.status(200).json({
    developer: {
      id: req.developer._id,
      username: req.developer.username,
      email: req.developer.email,
      apiKey: req.developer.apiKey,
    },
  });
};
