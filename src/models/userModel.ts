import mongoose, { model, Schema } from "mongoose";
import { type IUser } from "../types/types";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { hashData } from "../utils/authorization";

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    lastChangedPassword: {
      type: Date,
      default: new Date(),
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer not to say"],
      default: "prefer not to say",
    },
    relationshipStatus: {
      type: String,
      enum: ["single", "married", "prefer not to say"],
      default: "prefer not to say",
    },
    kids: {
      type: String,
      enum: ["yes", "no", "prefer not to say"],
      default: "prefer not to say",
    },
    healthStatus: {
      type: String,
      enum: ["excellent", "good", "fair", "poor", "prefer not to say"],
      default: "prefer not to say",
    },
    disabilityStatus: {
      type: String,
      enum: ["yes", "no", "prefer not to say"],
      default: "prefer not to say",
    },
    disability: {
      type: String,
      enum: ["deaf", "blind", "speech impairment", "prefer not to say"],
      default: "prefer not to say",
    },
    location: {
      type: String,
    },
    hobbies: {
      type: [String],
      default: [],
    },
    otp: {
      type: String,
    },
    otpExpiry: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpiry: {
      type: Date,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    registrationCompleted: {
      type: Boolean,
      default: false,
    },
    events: { type: [mongoose.Schema.Types.ObjectId], ref: "Event" },
  },
  { timestamps: true },
);

// For page efficient skip of page
userSchema.index({ createdAt: -1 });

// Exclude password before sending response to user
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.otp;

  return userObject;
};

// Hash Password
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await hashData(this.password);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpiry = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

// Verify Password
userSchema.methods.isPasswordMatch = async function (
  inputPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(inputPassword, this.password);
};

export const UserModel = model<IUser>("User", userSchema);
