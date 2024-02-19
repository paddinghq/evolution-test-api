import { type Request, type Response, type NextFunction } from "express";
import { FavouriteModel } from "../models/favouriteModel";
import { EventModel } from "../models/eventModel";
import {
  ResourceNotFound,
  Conflict,
  Unauthorized,
} from "../middlewares/errorHandler";

class FavouriteService {
  /**
   * @method addFavourite
   * @static
   * @async
   * @returns {Promise<Response>}
   */
  static async addFavourite(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.authUser?.id;
      const { eventId } = req.body;

      if (!userId) {
        throw new Unauthorized("User not authenticated");
      }

      const existingFavourite = await FavouriteModel.findOne({
        userId,
        eventId,
      });
      if (existingFavourite) {
        throw new Conflict("Event already favourited");
      }

      const event = await EventModel.findOne({ _id: eventId });
      if (!event) {
        throw new ResourceNotFound("Event does not exist");
      }

      const favourite = new FavouriteModel({ userId, eventId });
      await favourite.save();

      res.status(201).json({
        status: "success",
        message: "Event added to favourites",
        event,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method getFavourites
   * @static
   * @async
   * @returns {Promise<Response>}
   */
  static async getFavourites(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.authUser?.id;

      if (!userId) {
        throw new Unauthorized("User not authenticated");
      }
      const favourites = await FavouriteModel.find({ userId }).populate(
        "eventId",
      );

      res.status(200).json({
        status: "success",
        message: "Favourites retrieved successfully",
        favourites,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method deleteFavourite
   * @static
   * @async
   * @returns {Promise<Response>}
   */
  static async deleteFavourite(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const userId = req.authUser?.id;
      const eventId = req.params.eventId;

      const favourite = await FavouriteModel.findOneAndDelete({
        userId,
        eventId,
      });

      if (!favourite) {
        throw new ResourceNotFound("Favourite not found");
      }

      res.status(200).json({
        status: "success",
        message: "Favourite deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default FavouriteService;
