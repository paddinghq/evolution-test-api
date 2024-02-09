import express from "express";
import usersRoute from "./users";
import authRoute from "./auth";
import eventRoute from "./event";
import favouriteRoute from "./favourites";
import multer from "multer";
import { authorizeUser } from "../middlewares/authorizeUser";

const router = express.Router();

// Declare multer expression
const storage = multer.diskStorage({});

const upload = multer({
  storage: storage,
});

router.get("/", (req, res) => {
  res.send("api is live!!");
});

// controllers for users route
router.use("/users", usersRoute);

router.use("/auth", authRoute);

router.use("/events", authorizeUser, upload.single("mediaFile"), eventRoute);

router.use("/favourites", authorizeUser, favouriteRoute);

export default router;
