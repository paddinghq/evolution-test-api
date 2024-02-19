import express from "express";
import {
  getNotifications,
  getNotification,
  removeNotification,
  countUnreadNotifications,
  markAllAsRead,
} from "../controllers/notificationController";

const router = express.Router();

router.get("/", getNotifications);

router.get("/unread-count", countUnreadNotifications);

router.put("/mark-all-as-read", markAllAsRead);

// Get Notification by id
router.get("/:id", getNotification);

// Remove Notification by id
router.delete("/:id", removeNotification);

export default router;
