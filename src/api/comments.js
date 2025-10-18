import express from "express";
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All comment routes require authentication
router.use(authMiddleware);

// Get all comments for a video (with pagination)
// GET /api/comments/:videoId?page=1&limit=10
router.get("/:videoId", getVideoComments);

// Add a new comment to a video
// POST /api/comments/:videoId
router.post("/:videoId", addComment);

// Update an existing comment
// PUT /api/comments/:commentId
router.put("/:commentId", updateComment);

// Delete a comment
// DELETE /api/comments/:commentId
router.delete("/:commentId", deleteComment);

export default router;
