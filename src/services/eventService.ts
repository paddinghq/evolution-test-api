import { NextFunction, Request, Response } from "express";
import { EventModel } from "../models/eventModel";
import { IEvent } from "../types/eventType";
import { validateEvent, validateEventUpdate } from "../utils/eventValidator";
import { IError } from "../utils/validator";
import {
    InvalidInput,
    ServerError,
    ResourceNotFound,
    BadRequest,
} from "../middlewares/errorHandler";
import { UserModel } from "../models/userModel";
import { IUser } from "../types/types";
import { saveToCloudinary } from "../utils/mediaUpload";

class eventService {
    /**
     * @method createEvent
     * @static
     * @async
     * @returns {Promise<void>}
     */

    static async createEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const reqBody: IEvent = req.body;

            // Validate input
            const errors: IError[] = await validateEvent(reqBody);
            if (errors.length > 0) {
                throw new InvalidInput("Invalid Input", errors);
            }


            const authUser: IUser | undefined = req.authUser;

            // Remove duplicate invitees
            reqBody.inviteesEmail = Array.from(new Set(reqBody.inviteesEmail));
            reqBody.inviteesPhoneNumber = Array.from(
                new Set(reqBody.inviteesPhoneNumber)
            );

            let event

            if (req.file) {
                let uploadedFile = await saveToCloudinary(req.file.path, "EventsMedia")
                const { secure_url, bytes, format, resource_type } = uploadedFile
                // Create event
                event = await new EventModel({
                    ...reqBody,
                    createdBy: authUser?._id,
                    mediaUpload: {
                        type: resource_type,
                        url: secure_url
                    }
                });
            } else {
                // Create event
                event = await new EventModel({
                    ...reqBody,
                    createdBy: authUser?._id,
                });
            }

            // Throw error if event was not created successfully.
            if (!event) {
                throw new ServerError("An error occurred trying to create a post ...");
            }

            // Save to database
            event.save()

            // Update the users database.
            await UserModel.updateOne(
                { _id: authUser?._id },
                { $push: { events: event } }
            );

            return res.status(201).json({
                success: true,
                message: "Event created successfully!",
                data: event,
            });

        } catch (error) {
            next(error);
        }
    }


}

export default eventService;
