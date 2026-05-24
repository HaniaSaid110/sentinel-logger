import Application from "../models/Application.js";
import Developer from "../models/Developer.js";
import Log from "../models/Log.js";

// ─── GET /api/applications/:name/logs ────────────────────────────────────────
export const getLogs = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      name: req.params.name.toLowerCase(),
      createdBy: req.developer._id,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const {
      level,
      message,
      sortBy = "recent", // "recent" | "count"
      page = 1,
      limit = 10,
    } = req.query;

    // ── Build filter object ────────────────────────────────────────────────────
    const filter = { applicationId: application._id };

    if (level && ["INFO", "WARN", "ERROR"].includes(level.toUpperCase())) {
      filter.level = level.toUpperCase();
    }

    if (message) {
      filter.message = { $regex: message, $options: "i" };
    }

    // ── Sort ──────────────────────────────────────────────────────────────────
    const sortOption =
      sortBy === "count" ? { count: -1 } : { updatedAt: -1 };

    // ── Pagination ────────────────────────────────────────────────────────────
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [logs, total] = await Promise.all([
      Log.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Log.countDocuments(filter),
    ]);

    res.status(200).json({
      logs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/applications/:name/logs ───────────────────────────────────────
export const postLog = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res
        .status(401)
        .json({ message: "x-api-key header is required" });
    }

    // Validate API key belongs to a real developer
    const developer = await Developer.findOne({ apiKey });
    if (!developer) {
      return res.status(401).json({ message: "Invalid API key" });
    }

    // Validate the application exists AND belongs to that developer
    const application = await Application.findOne({
      name: req.params.name.toLowerCase(),
      createdBy: developer._id,
    });

    if (!application) {
      return res.status(404).json({
        message:
          "Application not found or does not belong to this API key owner",
      });
    }

    const { message, level } = req.body;

    if (!message || !level) {
      return res
        .status(400)
        .json({ message: "message and level are required" });
    }

    if (!["INFO", "WARN", "ERROR"].includes(level.toUpperCase())) {
      return res
        .status(400)
        .json({ message: "level must be INFO, WARN, or ERROR" });
    }

    // ── Upsert: increment count if same message+level exists, else create ──────
    const log = await Log.findOneAndUpdate(
      {
        applicationId: application._id,
        message,
        level: level.toUpperCase(),
      },
      {
        $inc: { count: 1 },
        $set: { updatedAt: new Date() },
        $setOnInsert: { createdAt: new Date() },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(201).json({ message: "Log recorded", log });
  } catch (err) {
    next(err);
  }
};
