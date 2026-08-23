import { Router } from "express";

import {
    askAI,
    uploadPDF,
} from "../controllers/ai.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Authentication required for both AI features
router.use(verifyJWT);

// ============================
// AI Chat
// POST /api/v1/ai/chat
// ============================
router.post("/chat", askAI);

// ============================
// PDF Upload
// POST /api/v1/ai/upload-pdf
// ============================
router.post(
    "/upload-pdf",
    upload.single("file"),
    uploadPDF
);

export default router;