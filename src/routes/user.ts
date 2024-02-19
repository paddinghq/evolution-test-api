import express from "express";
import UserController from "../controllers/userControllers";
import { authorizeUser } from "../middlewares/authorizeUser";

const router = express.Router();
const userController = new UserController();

// Get users
router.get("/", userController.getUsers);

// Get user profile
router.get("/me", authorizeUser, userController.getUserProfile);

// Get User
router.get("/:id", userController.getUser);

export default router;
