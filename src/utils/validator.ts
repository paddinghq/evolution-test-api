import { SignInUser, type IUser } from "../types/types";
// import { isValidPhone } from "./otp";

export interface IError {
  field: string;
  message: string;
}

export async function validateSignup(payload: IUser): Promise<IError[]> {
  const errors = [];

  if (payload == null || JSON.stringify(payload) === "{}") {
    errors.push({
      field: "payload",
      message: "Payload is required",
    });
    return errors;
  }

  const { email, fullName, password, phone, dateOfBirth } = payload;

  const emailErrors = validateEmail(email);
  if (emailErrors.length > 0) {
    errors.push(...emailErrors);
  }

  if (phone == null || phone === "") {
    errors.push({
      message: "Phone number is required",
      field: "phone",
    });

    return errors;
  }

  // const validPhone = await isValidPhone(phone);
  // if (!validPhone) {
  //   errors.push({
  //     message: "Invalid phone number",
  //     field: "phone",
  //   });
  // }

  if (fullName == null || fullName === "") {
    errors.push({
      message: "Fullname is required",
      field: "fullName",
    });

    return errors;
  }

  // Fullname must be at least 3 characters long
  if (payload.fullName.length < 3) {
    errors.push({
      message: "Fullname must be at least 3 characters long",
      field: "fullName",
    });
  }

  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    errors.push(...passwordErrors);
  }

  return errors;
}

export async function validateCompleteSignup(
  payload: IUser,
): Promise<IError[]> {
  const errors = [];

  if (payload == null || JSON.stringify(payload) === "{}") {
    errors.push({
      field: "payload",
      message: "Payload is required",
    });
    return errors;
  }

  const { email, dateOfBirth } = payload;

  const emailErrors = validateEmail(email);
  if (emailErrors.length > 0) {
    errors.push(...emailErrors);
  }

  const dateOfBirthErrors = validateDateOfBirth(dateOfBirth);
  if (dateOfBirthErrors.length > 0) {
    errors.push(...dateOfBirthErrors);
  }

  return errors;
}

export async function validateSignIn(payload: SignInUser): Promise<IError[]> {
  const errors = [];

  if (payload == null) {
    errors.push({
      field: "payload",
      message: "Payload is required",
    });
    return errors;
  }

  const { email, password } = payload;

  const emailErrors = validateEmail(email);
  if (emailErrors.length > 0) {
    errors.push(...emailErrors);
  }

  if (password == null || password === "") {
    errors.push({
      field: "password",
      message: "Password is required",
    });
    return errors;
  }

  return errors;
}

export function validateEmail(email: string): IError[] {
  const errors = [];
  if (email == null || email === "") {
    errors.push({
      field: "email",
      message: "Email is required",
    });
    return errors;
  }

  const emailRegex = /\S+@\S+\.[a-zA-Z]+$/;
  if (!emailRegex.test(email)) {
    errors.push({
      field: "email",
      message: "Invalid email",
    });
  }

  return errors;
}

export function validatePassword(password: string): IError[] {
  const errors = [];

  if (password == null || password === "") {
    errors.push({
      field: "password",
      message: "Password is required",
    });
    return errors;
  }

  // Password must be at least 8 characters long
  if (password.length < 8) {
    errors.push({
      message: "Password must be at least 8 characters long",
      field: "password",
    });
  }

  // Password must contain at least 1 lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push({
      message: "Password must contain at least 1 lowercase letter",
      field: "password",
    });
  }

  // Password must contain at least 1 uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push({
      message: "Password must contain at least 1 uppercase letter",
      field: "password",
    });
  }

  // Password must contain at least 1 number
  if (!/\d/.test(password)) {
    errors.push({
      message: "Password must contain at least 1 number",
      field: "password",
    });
  }

  // Password must contain at least 1 special character
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push({
      message: "Password must contain at least 1 special character",
      field: "password",
    });
  }

  return errors;
}

function validateDateOfBirth(dob: Date): IError[] {
  const errors = [];
  if (dob == null) {
    errors.push({
      message: "Date of birth is required",
      field: "dateOfBirth",
    });
    return errors;
  }

  const dateOfBirth = new Date(dob);

  if (dateOfBirth.toString() === "Invalid Date") {
    errors.push({
      message: "Invalid date of birth",
      field: "dateOfBirth",
    });
  }

  if (dateOfBirth > new Date()) {
    errors.push({
      message: "Date of birth cannot be in the future",
      field: "dateOfBirth",
    });
  }

  if (dateOfBirth < new Date("1900-01-01")) {
    errors.push({
      message: "Date of birth cannot be earlier than 1900",
      field: "dateOfBirth",
    });
  }

  if (dateOfBirth > new Date("2003-01-01")) {
    errors.push({
      message: "You must be at least 18 years old to register",
      field: "dateOfBirth",
    });
  }

  return errors;
}
export function validateId(id: string): IError[] {
  const errors = [];

  if (id == null || id === "") {
    errors.push({
      field: "id",
      message: "id is required",
    });
    return errors;
  }

  if (id.length < 24 || id.length > 24) {
    errors.push({
      message: "id must be 24 characters long",
      field: "id",
    });
  }

  return errors;
}
