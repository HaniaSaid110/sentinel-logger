import { Router } from "express";
import {
  getAll,
  getByName,
  create,
  deleteByName,
} from "../controllers/applicationController.js";
import { protect } from "../middlewares/auth.js";
import logRoutes from "./logRoutes.js";

const router = Router();

// All application routes require authentication
router.use(protect);

router.get("/", getAll);
router.get("/:name", getByName);
router.post("/", create);
router.delete("/:name", deleteByName);

// ─── Nested log routes: /api/applications/:name/logs ─────────────────────────
router.use("/:name/logs", logRoutes);

export default router;
