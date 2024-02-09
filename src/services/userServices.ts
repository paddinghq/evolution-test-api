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
