import { UserModel } from "../models/userModel";
import { verifyToken } from "../utils/authorization";
import { NextFunction, Request, Response } from "express";
import { IUser } from "../types/types";
import { Forbidden, Unauthorized } from "./errorHandler";

// Extend the Request interface to include a custom property
declare global {
  namespace Express {
    interface Request {
      authUser?: IUser;
    }
  }
}

export const authorizeUser = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    // Retrieve the token from the Authorization header in the request
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw new Unauthorized("Token not found");
    }

    // Extract the token without the "Bearer" prefix
    const token = authorizationHeader.split(" ")[1];

    if (!token) {
      throw new Unauthorized("Invalid token");
    }

    const decodedUser: any | undefined = verifyToken(token);

    if (decodedUser == null) {
      throw new Forbidden("Invalid token");
    }

    const user: IUser | undefined | null = await UserModel.findById(
      decodedUser.id,
    );

    if (user == null) {
      throw new Unauthorized("Unauthorized");
    }

    const lastTokenDate = decodedUser.iat * 1000;
    const passwordUpdatedTime = user.lastChangedPassword?.getTime() || 0;

    // Further user authentication
    if (lastTokenDate < passwordUpdatedTime) {
      throw new Unauthorized(
        "Your cookie session has expired, please login again",
      );
    }

    // Store authenticated user id in the request object.
    req.authUser = user;

    return next();
  } catch (error) {
    next(error);
  }
};
