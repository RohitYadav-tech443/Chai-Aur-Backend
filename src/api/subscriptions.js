import express from "express";
import {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels,
} from "../controllers/subscription.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All subscription routes require authentication
router.use(authMiddleware);

// Subscribe / unsubscribe to a channel
// POST /api/subscriptions/:channelId/toggle
router.post("/:channelId/toggle", toggleSubscription);

// Get all subscribers of a channel
// GET /api/subscriptions/:channelId/subscribers
router.get("/:channelId/subscribers", getUserChannelSubscribers);

// Get all channels a user is subscribed to
// GET /api/subscriptions/subscriber/:subscriberId/channels
router.get("/subscriber/:subscriberId/channels", getSubscribedChannels);

export default router;
