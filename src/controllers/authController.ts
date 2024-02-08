import { type NextFunction, type Request, type Response } from "express";
import AuthService from "../services/authService";

class AuthController {
  private readonly authService: typeof AuthService;
  constructor() {
    this.authService = AuthService;
  }

  /**
   * @route POST api/v1/auth/signup
   * @desc Register a user
   * @access Public
   */
  signup = async (req: Request, res: Response, next: NextFunction) => {
    await this.authService.signup(req, res, next);
  };

  /**
   * @route POST api/v1/auth/verify-otp
   * @desc Verify a user
   * @access Public
   */
  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    await this.authService.verifyOtp(req, res, next);
  };

  /**
   * @route POST api/v1/auth/signin
   * @desc Login a user
   * @access Public
   */
  signin = async (req: Request, res: Response, next: NextFunction) => {
    await this.authService.signin(req, res, next);
  };

  /**
   * @route POST api/v1/auth/complete-signup
   * @desc Complete user registration
   * @access Public
   */

  completeSignup = async (req: Request, res: Response, next: NextFunction) => {
    await this.authService.completeSignup(req, res, next);
  };

  /**
   * @route POST api/v1/auth/request-otp
   * @desc Request for otp
   * @access Public
   */
  requestOtp = async (req: Request, res: Response, next: NextFunction) => {
    await this.authService.requestOtp(req, res, next);
  };

  /**
   * @route POST api/v1/auth/forgot-password
   * @desc send otp to user mail
   * @access Public
   */

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    await this.authService.forgotpassword(req, res, next);
  };

  /**
   * @route PUT api/v1/auth/reset-password
   * @desc update user password
   * @access Public
   */

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    await this.authService.resetpassword(req, res, next);
  };
}

export default AuthController;
