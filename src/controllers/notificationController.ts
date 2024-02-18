import { Request, Response, NextFunction } from "express";
import NotificationService from "../services/notificationService";
import INotification from "../types/notificationType";



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

  // get notification by id
  export const getNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const notificationId = req.params.id

      const notification = await NotificationService.getNotification(notificationId);
  
      res.status(200).json({
        message:
          notification
            ? "Notification retrieved successfully"
            : "You have no notifications",
        body: notification,
        success: true,
        statusCode: 200,
      });
    } catch (error: any) {
        next(error);
    }
  };

  // Remove notification
  export const removeNotification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      const notificationId = req.params.id

      const removedNotification = await NotificationService.removeNotification(notificationId);
  
      res.status(200).json({
        message:
          removedNotification 
            ? "Notification removed successfully"
            : "You have no notifications",
        body: removedNotification,
        success: true,
        statusCode: 200,
      });
    } catch (error: any) {
        next(error);
    }
  };

  