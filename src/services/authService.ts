/* eslint-disable @typescript-eslint/no-extraneous-class */
import { type NextFunction, type Request, type Response } from "express";
// import formatHTTPLoggerResponse, { httpLogger } from "./LoggerService";
import { UserModel } from "../models/userModel";
import { type IUser  } from "../types/types";
import {
  BadRequest,
  Conflict,
  InvalidInput,
  ResourceNotFound,
  Unauthorized,
} from "../middlewares/errorHandler";
// import { generateToken, hashData, verifyToken } from "../utils/authorization";
import {
  type IError,
  validateSignup,
  validatePassword,
  validateEmail,
  validateCompleteSignup,
} from "../utils/validator";
import crypto from "crypto";
import { handleEmailVerification, sendMail } from "../utils/email";

class AuthService {
  /**
   * @method signup
   * @static
   * @async
   * @returns {Promise<void>}
   */
  static async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const reqBody: IUser = {
        ...req.body,
        _id: undefined,
        isVerified: undefined,
        registrationCompleted: undefined,
      };

      const errors: IError[] = await validateSignup(reqBody);
      if (errors.length > 0) {
        throw new InvalidInput("Invalid input", errors);
      }

      let { email } = reqBody;

      email = email.toLowerCase();
      reqBody.email = email;

      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });

      if (existingUser != null) {
        throw new Conflict("User already exists");
      }

      const newUser = new UserModel(reqBody);

      const { verificationCode, otpExpiry } =
        await handleEmailVerification(email);

      newUser.otp = verificationCode;
      newUser.otpExpiry = otpExpiry;
      // await sendVerificationCode(phone);

      // Save user if there is no error
      await newUser.save();

      const resPayload = {
        success: true,
        message: `A verification code was sent to ${email}`,
        user: newUser.toJSON(),
      };

      res.status(201).json(resPayload);

      // httpLogger.info(
      //   "User registered successfully",
      //   formatHTTPLoggerResponse(req, res, resPayload)
      // );
    } catch (error) {
      next(error);
    }
  }


}

export default AuthService;
