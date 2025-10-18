import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/fileUpload.middleware.js"; // multer middleware

const router = express.Router();

// Public Routes
router.post("/register", upload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "coverImage", maxCount: 1 }
]), registerUser);

router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

// Protected Routes (require auth)
router.use(authMiddleware); // All routes below require authentication

router.post("/logout", logoutUser);
router.get("/me", getCurrentUser);
router.patch("/change-password", changeCurrentPassword);
router.patch("/update-account", updateAccountDetails);

// Upload avatar or cover image
router.patch("/avatar", upload.single("avatar"), updateUserAvatar);
router.patch("/cover-image", upload.single("coverImage"), updateUserCoverImage);

// User channel & watch history
router.get("/channel/:username", getUserChannelProfile);
router.get("/watch-history", getWatchHistory);

export default router;
