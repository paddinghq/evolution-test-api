import express from "express";
import usersRoute from "./users";
import authRoute from "./auth";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("api is live!!");
});

// controllers for users route
router.use("/users", usersRoute);

router.use("/auth", authRoute);

export default router;
