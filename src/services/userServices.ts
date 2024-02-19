/* eslint-disable @typescript-eslint/no-extraneous-class */
import { type NextFunction, type Request, type Response } from "express";
import { UserModel } from "../models/userModel";
// import formatHTTPLoggerResponse, { httpLogger } from "./LoggerService";
import {
  Forbidden,
  InvalidInput,
  ResourceNotFound,
  ServerError,
} from "../middlewares/errorHandler";
import { IUser } from "../types/types";
import { IError } from "../utils/validator";
import { handleEmailVerification } from "../utils/email";
import { hashData } from "../utils/authorization";

class userService {
  /**
   * @method getAllUsers
   * @static
   * @async
   * @returns {Promise<IUsers>}
   */

  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page: number = parseInt(req.query.page as string, 10) || 1;
      const limit: number = parseInt(req.query.limit as string, 10) || 10;
      const pageSkip = (page - 1) * limit;

      const users = await UserModel.find({})
        .sort({ createdAt: -1 })
        .skip(pageSkip)
        .limit(limit);

      const total = await UserModel.countDocuments();

      return res.status(200).json({
        success: true,
        data: users,
        page,
        per_page: limit,
        total,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method getUser
   * @static
   * @async
   * @returns {Promise<IUsers>}
   */

  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id: string = req.params.id;

      const user = await UserModel.findOne({ _id: id });

      if (!user) {
        throw new ResourceNotFound("No user found!!");
      }
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method getUserProfile
   * @static
   * @async
   * @returns {Promise<void>}
   */

  static async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const authUserId = req.authUser?.id;

      if (authUserId == null) {
        throw new Forbidden("You are not authorized to perform this action");
      }

      const user = await UserModel.findOne({ _id: authUserId });

      if (!user) {
        throw new ResourceNotFound("No user found!!");
      }

      // httpLogger.info(
      //   `User with id: ${authUserId} retrieved successfully!`,
      //   formatHTTPLoggerResponse(req, res, user)
      // );

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      // httpLogger.error(
      //   `Failed with ${error} error`,
      //   formatHTTPLoggerResponse(req, res, { message: error })
      // );
      next(error);
    }
  }
}

export default userService;
