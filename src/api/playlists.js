import express from "express";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All playlist routes require authentication
router.use(authMiddleware);

// Create a playlist for a video
// POST /api/playlist/:videoId
router.post("/:videoId", createPlaylist);

// Get all playlists of a user
// GET /api/playlist/user/:userId
router.get("/user/:userId", getUserPlaylists);

// Get playlist by ID
// GET /api/playlist/:playlistId
router.get("/:playlistId", getPlaylistById);

// Add a video to playlist
// PATCH /api/playlist/:playlistId/video/:videoId/add
router.patch("/:playlistId/video/:videoId/add", addVideoToPlaylist);

// Remove a video from playlist
// PATCH /api/playlist/:playlistId/video/:videoId/remove
router.patch("/:playlistId/video/:videoId/remove", removeVideoFromPlaylist);

// Delete a playlist
// DELETE /api/playlist/:playlistId
router.delete("/:playlistId", deletePlaylist);

// Update a playlist
// PATCH /api/playlist/:playlistId
router.patch("/:playlistId", updatePlaylist);

export default router;
