
import { NextFunction,Request, Response } from 'express';
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

  /**
   * @route GET api/v1/user
   * @desc get a registered user
   * @access Public
   */
  getUser = async (req:Request, res:Response, next:NextFunction) => {
    await this.userService.getUser(req, res, next);
  };

}

export default UserController;
