import express from "express";
import FavouritesController from "../controllers/favouriteController";

const router = express.Router();
const favouritesController = new FavouritesController();

// Get Favourite events
router.get("/", favouritesController.getFavourites);

// Add a Favourite event
router.post("/", favouritesController.addFavourite);

// Delete a Favourite event
router.delete("/:eventId", favouritesController.deleteFavourite);

export default router;
