import Application from "../models/Application.js";
import Log from "../models/Log.js";

// ─── GET /api/applications ────────────────────────────────────────────────────
export const getAll = async (req, res, next) => {
  try {
    const applications = await Application.find({
      createdBy: req.developer._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/applications/:name ──────────────────────────────────────────────
export const getByName = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      name: req.params.name.toLowerCase(),
      createdBy: req.developer._id,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ application });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/applications ───────────────────────────────────────────────────
export const create = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Application name is required" });
    }

    const application = await Application.create({
      name,
      createdBy: req.developer._id,
    });

    res.status(201).json({
      message: "Application created",
      application,
    });
  } catch (err) {
    // Mongoose duplicate key error
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Application name already exists" });
    }
    next(err);
  }
};

// ─── DELETE /api/applications/:name ──────────────────────────────────────────
export const deleteByName = async (req, res, next) => {
  try {
    const application = await Application.findOneAndDelete({
      name: req.params.name.toLowerCase(),
      createdBy: req.developer._id,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Cascade-delete all logs belonging to this application
    await Log.deleteMany({ applicationId: application._id });

    res.status(200).json({ message: "Application and its logs deleted" });
  } catch (err) {
    next(err);
  }
};
