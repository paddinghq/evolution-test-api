import express from "express";
<<<<<<< HEAD
import { getNotifications, getNotification, removeNotification } from "../controllers/notificationController";
=======
import {
  countUnreadNotifications,
  getNotifications,
  markAllAsRead,
} from "../controllers/notificationController";
>>>>>>> f20f859 (add unread notifications count feat)

const router = express.Router();

router.get("/", getNotifications);

<<<<<<< HEAD
// Get Notification by id
router.get("/:id", getNotification)

//Remove Notification by id
router.delete("/:id", removeNotification)


export default router;
=======
router.get("/unread-count", countUnreadNotifications);

router.put("/mark-all-as-read", markAllAsRead);

export default router;
>>>>>>> f20f859 (add unread notifications count feat)
