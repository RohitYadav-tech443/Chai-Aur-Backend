import express from "express";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet,
} from "../controllers/tweet.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router({ mergeParams: true }); // mergeParams to get videoId from parent route

// All tweet routes require authentication
router.use(authMiddleware);

// Create a tweet for a video
// POST /api/tweets/:videoId
router.post("/:videoId", createTweet);

// Get all tweets of a user for a video
// GET /api/tweets/:videoId/:owner
router.get("/:videoId/:owner", getUserTweets);

// Update a tweet
// PATCH /api/tweets/:tweetId
router.patch("/:tweetId", updateTweet);

// Delete a tweet
// DELETE /api/tweets/:tweetId
router.delete("/:tweetId", deleteTweet);

export default router;
