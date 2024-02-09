import express from "express";
import UserController from "../controllers/userControllers";
import { authorizeUser } from "../middlewares/authorizeUser";

const router = express.Router();
const userController = new UserController();

// Get user profile
router.get("/me", authorizeUser, userController.getUserProfile);

export default router;