import { Router } from "express";
import { getLogs, getStats } from "../controllers/logController.js";

// mergeParams: true allows access to :name from the parent application router
const router = Router({ mergeParams: true });

// GET  /api/applications/:name/logs/stats — analytics (must be before /)
router.get("/stats", getStats);

// GET  /api/applications/:name/logs  — requires JWT (protected by parent router)
router.get("/", getLogs);

// NOTE: POST /api/applications/:name/logs is mounted directly in applicationRoutes.js
// BEFORE the protect middleware, so the SDK can use x-api-key without a JWT cookie.

export default router;

