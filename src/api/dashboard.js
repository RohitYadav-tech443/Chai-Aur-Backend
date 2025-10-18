import express from "express";
import { getChannelStats, getChannelVideos } from "../controllers/dashboard.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All dashboard routes require authentication
router.use(authMiddleware);

// Get overall stats for a channel
// GET /api/dashboard/stats/:channelId
router.get("/stats/:channelId", getChannelStats);

// Get all videos uploaded by a channel
// GET /api/dashboard/videos/:channelId
router.get("/videos/:channelId", getChannelVideos);

export default router;
