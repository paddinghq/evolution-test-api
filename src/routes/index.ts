import express from "express";
import usersRoute from "./users";
import authRoute from "./auth";
import eventRoute from "./event"
import multer from 'multer';
import { authorizeUser } from "../middlewares/authorizeUser";


const router = express.Router();

// Declare multer expression
const storage = multer.diskStorage({});

const upload = multer({
    storage: storage
});

router.get("/", (req, res) => {
  res.send("api is live!!");
});

// controllers for users route
router.use("/users", usersRoute);

router.use("/auth", authRoute);

router.use("/events", authorizeUser, upload.single("mediaFile"), eventRoute)

export default router;
