import { Router } from "express";
import { getLogs, postLog } from "../controllers/logController.js";

// mergeParams: true allows access to :name from the parent application router
const router = Router({ mergeParams: true });

// GET  /api/applications/:name/logs  — requires JWT (protected by parent router)
router.get("/", getLogs);

// POST /api/applications/:name/logs  — validated by x-api-key header (SDK usage)
router.post("/", postLog);

export default router;
