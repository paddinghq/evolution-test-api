import nodemailer, { type Transporter } from "nodemailer";
import { generateOtp } from "./otp";

function initializeTransporter() {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASSWORD;
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    service: process.env.MAIL_SERVICE,
    port: parseInt(process.env.MAIL_PORT as string, 10),
    auth: {
      user: user,
      pass: pass,
    },
  });
  return transporter;
}

export const sendMail = async (
  email: string,
  subject: string,
  text: string
): Promise<void> => {
  const mailOption = {
    from: process.env.MAIL_USER,
    to: email,
    subject,
    text,
  };
  const transporter: Transporter = initializeTransporter();

  try {
    await transporter.sendMail(mailOption);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error sending email: ${error.message}`);
    }
  }
};

interface IOtp {
  verificationCode?: string;
  otpExpiry?: Date;
}

// Separate function for handling email verification
export async function handleEmailVerification(email?: string,subject? :any): Promise<IOtp> {
  if (email == null) {
    return {};
  }
  const verificationCode = generateOtp();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await sendMail(
    email,
    subject,
    `Your verification code is: ${verificationCode}`
  );

  return { verificationCode, otpExpiry };
}
