import express from "express";
import { createNote, getNotesByTask } from "../controllers/noteController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authMiddleware, createNote);
router.get("/task/:taskId", authMiddleware, getNotesByTask);

export default router;
