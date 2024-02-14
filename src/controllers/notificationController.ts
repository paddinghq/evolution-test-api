import { Request, Response, NextFunction } from "express";
import NotificationService from "../services/notificationService";



export const getNotifications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
  
      const notifications = await NotificationService.getNotifications();
  
      res.status(200).json({
        message:
          notifications.length > 0
            ? "Notification retrieved successfully"
            : "You have no notifications",
        body: notifications,
        success: true,
        statusCode: 200,
      });
    } catch (error: any) {
        next(error);
    }
  };