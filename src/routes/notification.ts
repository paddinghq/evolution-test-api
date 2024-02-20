import express from "express";
import {
  getNotifications,
  getNotification,
  removeNotification,
  countUnreadNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notificationController";

const router = express.Router();

router.get("/", getNotifications);

router.get("/unread-count", countUnreadNotifications);

router.put("/mark-all-as-read", markAllAsRead);

router.put("/read/:id", markAsRead)

// Get Notification by id
router.get("/:id", getNotification);

// Remove Notification by id
router.delete("/:id", removeNotification);

export default router;
