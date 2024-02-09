import express from "express";
import UserController from "../controllers/userControllers";
import { authorizeUser } from "../middlewares/authorizeUser";

const router = express.Router();
const userController = new UserController();

// Get a user
router.get("/:id", authorizeUser, userController.getUser);

export default router;