import { Router } from "express";
import {
  getAll,
  getByName,
  create,
  deleteByName,
} from "../controllers/applicationController.js";
import { protect } from "../middlewares/auth.js";
import { postLog } from "../controllers/logController.js";
import logRoutes from "./logRoutes.js";

const router = Router();

// ─── SDK ingestion route — uses x-api-key, NO JWT required ───────────────────
// Must be mounted BEFORE the protect middleware
router.post("/:name/logs", postLog);

// All remaining routes require JWT authentication
router.use(protect);

router.get("/", getAll);
router.get("/:name", getByName);
router.post("/", create);
router.delete("/:name", deleteByName);

// ─── Nested log routes (GET + stats) — protected by JWT ──────────────────────
router.use("/:name/logs", logRoutes);

export default router;
