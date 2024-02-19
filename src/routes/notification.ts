import express from "express";
import { getNotifications, getNotification, removeNotification } from "../controllers/notificationController";

const router = express.Router();



router.get("/", getNotifications);

// Get Notification by id
router.get("/:id", getNotification)

//Remove Notification by id
router.delete("/:id", removeNotification)


export default router;