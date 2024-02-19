import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { InvalidInput } from "../middlewares/errorHandler";

// Generate token for authorization
export const generateToken = (payload: object, tokenType: string) => {
  const secretKey: string | undefined = process.env.JWT_SECRET;

  if (secretKey == null) {
    throw new Error("JWT secret key is not defined");
  }

  let expiresIn: string | number = "4h";
  if (tokenType === "refresh") {
    expiresIn = "7d";
  } else if (tokenType === "reset") {
    return;
  } else if (tokenType === "access") {
    expiresIn = "4h";
  }

  const token = jwt.sign(payload, secretKey, { expiresIn });
  if (!token) {
    throw new Error("Failed to generate token");
  }
  return token;
};

// Verify token
export const verifyToken = (
  token: string | undefined,
): JwtPayload | undefined => {
  try {
    const secretKey: string | undefined = process.env.JWT_SECRET;
    if (!token || !secretKey) {
      throw new InvalidInput("Token or secretKey is missing");
    }

    const decodedUser: JwtPayload = jwt.verify(token, secretKey) as JwtPayload;

    return decodedUser;
  } catch (error) {
    throw new InvalidInput("Invalid token");
  }
};

export const hashData = async (data: string) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(data, salt);
  return hash;
};
