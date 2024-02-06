import express from 'express';
import usersRoute from "./users";


const router = express.Router();

router.get("/", (req, res) => {
    res.send("api is live!!");
  });

// controllers for users route
router.use("/users", usersRoute);


export default router;
