import { Request, Response, NextFunction } from "express";
import FavouriteService from "../services/favouriteService";

class FavouriteController {
  private readonly favouriteService: typeof FavouriteService;
  constructor() {
    this.favouriteService = FavouriteService;
  }

  /**
   * @route POST api/v1/favourites
   * @desc Add a favorite event
   * @access Private
   */
  addFavourite = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await this.favouriteService.addFavourite(req, res, next);
  };

  /**
   * @route GET api/v1/favourites
   * @desc Get all favorite events
   * @access Private
   */
  getFavourites = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await this.favouriteService.getFavourites(req, res, next);
  };

  /**
   * @route DELETE api/v1/favourites/:id
   * @desc Delete a favorite event
   * @access Private
   */
  deleteFavourite = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await this.favouriteService.deleteFavourite(req, res, next);
  };
}

export default FavouriteController;
