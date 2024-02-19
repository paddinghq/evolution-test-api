import { type Document, Types, Schema } from "mongoose";
// import { EventModel } from "../models/eventModel";

export interface IUser extends Document {
  email: string;
  fullName: string;
  password: string;
  lastChangedPassword: Date;
  phone: string;
  gender: string;
  relationshipStatus: string;
  kids: string;
  healthStatus: string;
  disabilityStatus: string;
  disability: string;
  location: string;
  dateOfBirth: Date;
  hobbies: string[];
  otp: string | undefined;
  otpExpiry: Date | undefined;
  passwordResetToken: string | undefined;
  passwordResetExpiry: Date | undefined;
  isVerified: boolean;
  registrationCompleted: boolean;
  events: Types.ObjectId[];
  isPasswordMatch: (inputPassword: string) => Promise<boolean>;
  generatePasswordResetToken: () => string;
}

export interface SignInUser {
  email: string;
  password: string;
}

export interface IFavourite {
  userId: Schema.Types.ObjectId;
  eventId: Schema.Types.ObjectId;
}
