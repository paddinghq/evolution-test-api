/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import AuthController from "../controllers/authController";

const router = express.Router();
const authController = new AuthController();

// route for authentication
router.get("/", (req, res) => {
  res.send("auth route");
});

router.post("/signup", authController.signup);

router.post("/verify-otp", authController.verifyOtp);

export default router;
