import { Schema, model } from "mongoose";
import { IUser } from "../types/types";
import bcrypt from "bcryptjs";

const userSchema = new Schema<IUser>(
  {
    email: { type: String, require: true, unique: true },
    firstName: { type: String, require: true },
  },
  { timestamps: true }
);

export const UserModel = model("User", userSchema);