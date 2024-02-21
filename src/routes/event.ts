import express from "express";
import EventController from "../controllers/eventController";

const router = express.Router();
const eventController = new EventController();

// Route for events
router.post("/", eventController.createEvent);

router.get("/", eventController.getEvents);

router.get("/:id", eventController.getEvent);

router.patch("/:id", eventController.updateEvent);

router.delete("/:id", eventController.deleteEvent);

export default router;
