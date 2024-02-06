// import { Twilio } from "twilio";

// let twilioClient: Twilio | null = null;

// function initializeTwilioClient(): Twilio | null {
//   const accountSid = process.env.TWILIO_ACCOUNT_SID;
//   const authToken = process.env.TWILIO_AUTH_TOKEN;
//   const serviceID = process.env.TWILIO_MESSAGING_SERVICE_SID;

//   // Check if all required environment variables are set
//   if (accountSid == null || authToken == null || serviceID == null) {
//     console.error(
//       "Error: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_MESSAGING_SERVICE_SID are required."
//     );
//     return null;
//   }

//   // Create a new Twilio client with the provided credentials
//   return new Twilio(accountSid, authToken);
// }

// // Function to get the Twilio client
// function getTwilioClient(): Twilio | null {
//   if (twilioClient == null) {
//     // Initialize the Twilio client if not already initialized
//     twilioClient = initializeTwilioClient();
//   }
//   return twilioClient;
// }

// async function isValidPhone(phone: string): Promise<boolean> {
//   const twilio = getTwilioClient();

//   if (twilio == null) {
//     // Handle the case where Twilio client is not initialized
//     console.error("Error: Twilio client not initialized.");
//     return false;
//   }

//   try {
//     const lookup = await twilio.lookups.v2.phoneNumbers(phone).fetch();
//     return lookup.valid;
//   } catch (error) {
//     console.error(
//       `Error checking phone validity: ${(error as Error).toString()}`
//     );
//     return false;
//   }
// }

// async function sendVerificationCode(phone: string): Promise<void> {
//   const twilio = getTwilioClient();

//   if (twilio == null) {
//     // Handle the case where Twilio client is not initialized
//     console.error("Error: Twilio client not initialized.");
//     return;
//   }

//   // Code expiry is set to 10 minutes by default
//   const customCode = Math.floor(100000 + Math.random() * 900000).toString();

//   try {
//     const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
//     if (messagingServiceSid == null) {
//       throw new Error("TWILIO_MESSAGING_SERVICE_SID is not defined.");
//     }

//     await twilio.verify.v2.services(messagingServiceSid).verifications.create({
//       to: phone,
//       channel: "sms",
//       customCode,
//     });
//     // await twilio.messages.create({
//     //   body: `Your verification code is ${customCode}`,
//     //   to: phone,
//     //   from: process.env.TWILIO_PHONE_NUMBER as string,
//     // });
//   } catch (error) {
//     console.error(
//       `Error sending verification code: ${(error as Error).toString()}`
//     );
//   }
// }

// async function isValidCode(phone: string, code: string): Promise<boolean> {
//   const twilio = getTwilioClient();

//   if (twilio == null) {
//     // Handle the case where Twilio client is not initialized
//     console.error("Error: Twilio client not initialized.");
//     return false;
//   }

//   try {
//     const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
//     if (messagingServiceSid == null) {
//       throw new Error("TWILIO_MESSAGING_SERVICE_SID is not defined.");
//     }
//     const verificationCheck = await twilio.verify.v2
//       .services(messagingServiceSid)
//       .verificationChecks.create({
//         to: phone,
//         code,
//       });

//     return verificationCheck.status !== "pending";
//   } catch (error) {
//     console.error(
//       `Error checking verification code: ${(error as Error).toString()}`
//     );
//     return false;
//   }
// }

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export { generateOtp };
