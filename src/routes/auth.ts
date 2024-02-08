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

router.post("/signin", authController.signin);

router.post("/complete-signup", authController.completeSignup);

router.post("/forgot-password", authController.forgotPassword);

router.put("/reset-password", authController.resetPassword);

export default router;
