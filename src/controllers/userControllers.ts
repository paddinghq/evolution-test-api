
import { Request, Response } from 'express';
import userService from '../services/userServices';


class UserController {
    private userService: typeof userService;
  constructor() {
    this.userService = userService;
  }
  /**
   * @route GET api/v1/users.
   * @desc get all registered users
   * @access Public.
   */
   getUsers = async (req:Request, res:Response) => {
    await this.userService.getAllUsers(req, res);
  };

}

export default UserController;
