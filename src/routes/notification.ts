import express from "express";
import {
  countUnreadNotifications,
  getNotifications,
  markAllAsRead,
} from "../controllers/notificationController";

const router = express.Router();

router.get("/", getNotifications);

router.get("/unread-count", countUnreadNotifications);

router.put("/mark-all-as-read", markAllAsRead);

export default router;
