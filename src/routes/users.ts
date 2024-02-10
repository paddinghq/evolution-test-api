import express from 'express';
import UserController from '../controllers/userControllers';

const router =  express.Router();
const userController = new UserController();

// route for users
router.get("/", (req, res) => {
  res.send("users route");
});

router.get("/All", userController.getUsers);
router.get('/:id', userController.getUser);


export default router;
