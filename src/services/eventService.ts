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
import triggerNotification from "../utils/triggerNotification";
import { INotificationUser } from "../types/notificationType";

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

      let event;

      if (req.file) {
        let uploadedFile = await saveToCloudinary(req.file.path, "EventsMedia");
        const { secure_url, bytes, format, resource_type } = uploadedFile;
        // Create event
        event = await new EventModel({
          ...reqBody,
          createdBy: authUser?._id,
          mediaUpload: {
            type: resource_type,
            url: secure_url,
          },
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
      event.save();

      // Update the users database.
      await UserModel.updateOne(
        { _id: authUser?._id },
        { $push: { events: event } }
      );

      res.status(201).json({
        success: true,
        message: "Event created successfully!",
        data: event,
      });

      const users = await UserModel.find();

      // trigger notification
      const notification = await triggerNotification({
        title: event.eventName,
        content: `${authUser?.fullName} created a new event: ${event.eventName}`,
        users,
        notificationIcon: "",
      });

      if (notification == null) {
        throw new ServerError("Could not trigger notification");
      }

      // add the notification to all users in the database
      await UserModel.updateMany(
        { _id: { $in: users } },
        { $push: { notifications: { notification: notification._id } } }
      ).exec();
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method getEvent
   * @static
   * @async
   * @returns {Promise<void>}
   */

  static async getEvents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let query = EventModel.find();
      const filters = req.query;
      const pageQuery: number = parseInt(req.query.page as string, 10) || 1;
      const limit: number = parseInt(req.query.limit as string, 10) || 10;

      if (filters && typeof filters === "object") {
        for (const key in filters) {
          if (filters.hasOwnProperty(key)) {
            if (EventModel.schema.paths.hasOwnProperty(key)) {
              query = query.where(key).equals(filters[key]);
            }
          }
        }
      }

      const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, page } =
        await EventModel.paginate(query, {
          limit,
          page: pageQuery,
          lean: true,
        });

      //   const events = await query.exec();
      const events = docs;

      const resPayload = {
        success: true,
        message: `Events retrieved successfully`,
        events,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        page,
      };

      res.status(200).json(resPayload);

      //   httpLogger.info(
      //     "Events retrieved successfully",
      //     formatHTTPLoggerResponse(req, res, resPayload)
      //   );
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method getEvent
   * @static
   * @async
   * @returns {Promise<void>}
   */

  static async getEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const eventId = req.params.id;

      const event = await EventModel.findOne({
        _id: eventId,
      });

      if (!event) {
        throw new ResourceNotFound("Event not found");
      }

      const resPayload = {
        success: true,
        message: `Event retrieved successfully`,
        event,
      };

      res.status(200).json(resPayload);

      //   httpLogger.info(
      //     "Event retrieved successfully",
      //     formatHTTPLoggerResponse(req, res, resPayload)
      //   );
    } catch (error) {
      next(error);
    }
  }
}

export default eventService;
