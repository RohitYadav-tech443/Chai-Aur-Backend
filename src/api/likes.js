import express from "express";
import {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos,
} from "../controllers/like.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All like routes require authentication
router.use(authMiddleware);

// Toggle like/unlike for a video
// POST /api/likes/video/:videoId
router.post("/video/:videoId", toggleVideoLike);

// Toggle like/unlike for a comment
// POST /api/likes/comment/:commentId
router.post("/comment/:commentId", toggleCommentLike);

// Toggle like/unlike for a tweet
// POST /api/likes/tweet/:tweetId
router.post("/tweet/:tweetId", toggleTweetLike);

// Get all videos liked by the logged-in user
// GET /api/likes/videos
router.get("/videos", getLikedVideos);

export default router;
