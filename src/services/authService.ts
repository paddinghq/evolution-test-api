/* eslint-disable @typescript-eslint/no-extraneous-class */
import { type NextFunction, type Request, type Response } from "express";
// import formatHTTPLoggerResponse, { httpLogger } from "./LoggerService";
import { UserModel } from "../models/userModel";
import { SignInUser, type IUser } from "../types/types";
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
  validateSignIn,
} from "../utils/validator";
import crypto from "crypto";
import { handleEmailVerification, sendMail } from "../utils/email";
import { generateToken } from "../utils/authorization";

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
        otp: undefined,
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

  /**
   * @method verifyOtp
   * @static
   * @async
   * @returns {Promise<void>}
   */
  static async verifyOtp(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, otp } = req.body;

      // const isValid = await isValidCode(phone, otp);
      // if (isValid) {}
      const user = await UserModel.findOne({ email });
      if (user == null) {
        throw new ResourceNotFound("User not found");
      }

      if (otp !== user.otp) {
        throw new Unauthorized("Invalid OTP");
      }

      if (user.otpExpiry && user.otpExpiry < new Date()) {
        const { verificationCode, otpExpiry } =
          await handleEmailVerification(email);
        // httpLogger.info("Verification email sent successfully");

        await user.updateOne({ otp: verificationCode, otpExpiry });

        throw new Unauthorized("OTP expired, check your email for new OTP");
      }

      user.isVerified = true;
      user.otp = undefined;
      user.otpExpiry = undefined;

      await user.save();

      res.status(200).json({
        success: true,
        message: "User verified successfully",
        user: user.toJSON(),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method signin
   * @static
   * @async
   * @returns {Promise<void>}
   */
  static async signin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const reqBody: SignInUser = req.body;

      const errors = await validateSignIn(reqBody);
      if (errors.length > 0) {
        throw new InvalidInput("Invalid input", errors);
      }

      let { email, password } = reqBody;
      email = email.toLowerCase();

      // Check if user exists
      const existingUser = await UserModel.findOne({ email });
      if (!existingUser) {
        throw new ResourceNotFound("User not found");
      }

      // Pasword Check
      const isPasswordMatch = await existingUser.isPasswordMatch(password);

      if (!isPasswordMatch) {
        throw new Unauthorized("Authentication failed: wrong password");
      }

      if (!existingUser.isVerified) {
        if (
          existingUser.otp == null ||
          (existingUser.otpExpiry && existingUser.otpExpiry < new Date())
        ) {
          const { verificationCode, otpExpiry } =
            await handleEmailVerification(email);

          // httpLogger.info("Verification email sent successfully");

          await existingUser.updateOne({ otp: verificationCode, otpExpiry });
        }

        throw new Unauthorized(
          "User is not verified, check your email for verification code"
        );
      }

      // Generate token for authorization
      const payload = { id: existingUser.id };

      const token = generateToken(payload, "access");
      res.header("authorization", `Bearer ${token}`);

      const resPayload = {
        success: true,
        message: "Login successful!",
        user: existingUser.toJSON(),
        token,
      };

      res.status(200).json(resPayload);

      // httpLogger.info(
      //   "Login successful",
      //   formatHTTPLoggerResponse(req, res, resPayload)
      // );
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method completeSignup
   * @static
   * @async
   * @returns {Promise<void>}
   */

  static async completeSignup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const reqBody = {
        ...req.body,
        _id: undefined,
        isVerified: undefined,
        registrationCompleted: undefined,
        otp: undefined,
      };

      const errors = await validateCompleteSignup(reqBody);
      if (errors.length > 0) {
        throw new InvalidInput("Invalid input", errors);
      }

      let { email } = reqBody;
      email = email.toLowerCase();
      reqBody.email = email;

      // Check if user exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser == null) {
        throw new ResourceNotFound("User not found");
      } else if (!existingUser.isVerified) {
        if (
          existingUser.otp == null ||
          (existingUser.otpExpiry && existingUser.otpExpiry < new Date())
        ) {
          const { verificationCode, otpExpiry } =
            await handleEmailVerification(email);

          // httpLogger.info("Verification email sent successfully");

          await existingUser.updateOne({ otp: verificationCode, otpExpiry });
        }

        throw new Unauthorized(
          "User is not verified, check your email for verification code"
        );
      }

      const updatedUser = await UserModel.findOneAndUpdate(
        { email },
        { ...reqBody, registrationCompleted: true },
        { new: true, runValidators: true }
      );

      if (updatedUser == null) {
        throw new BadRequest("User not found");
      }

      const resPayload = {
        success: true,
        message: "User registration completed",
        user: updatedUser.toJSON(),
      };

      res.status(200).json(resPayload);

      // httpLogger.info(
      //   "User verified successfully",
      //   formatHTTPLoggerResponse(req, res, resPayload)
      // );
    } catch (error) {
      next(error);
    }
  }
}

export default AuthService;
