import { type NextFunction, type Request, type Response } from "express";
import userService from "../services/userServices";

class UserController {
  private readonly userService: typeof userService;
  constructor() {
    this.userService = userService;
  }

  /**
   * @route GET api/v1/users/:id
   * @desc get a registered user
   * @access Private
   */
  getUser = async (req: Request, res: Response, next: NextFunction) => {
    await this.userService.getUser(req, res, next);
  };
}

export default UserController;