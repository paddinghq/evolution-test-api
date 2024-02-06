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
}

export default AuthController;
