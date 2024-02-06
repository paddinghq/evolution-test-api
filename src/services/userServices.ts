import express,{Request, Response} from 'express';
import { UserModel } from "../models/userModel"


class userService {
  /**
   * @method getAllUsers
   * @static
   * @async
   * @returns {Promise<IUsers>}
   */

  static async getAllUsers(req:Request, res:Response) {
    try {
      const users = await UserModel.find();

      if (users) {
        return res.status(401).json({
          message: `Users retrieved successfully`,
          data: users,
        })
      }
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        message: 'Internal Server Error',
        success: false,
      })
    }
  }
}

export default userService;