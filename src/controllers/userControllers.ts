import { type NextFunction, type Request, type Response } from "express";
import userService from "../services/userServices";

class UserController {
  private readonly userService: typeof userService;
  constructor() {
    this.userService = userService;
  }

  /**
   * @route GET api/v1/users/me
   * @desc get user profile
   * @access Private
   */
  getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    await this.userService.getUserProfile(req, res, next);
  };
}

export default UserController;