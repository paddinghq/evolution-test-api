import { Request, Response, NextFunction } from "express";
import NotificationService from "../services/notificationService";
import { Unauthorized } from "../middlewares/errorHandler";

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

export const countUnreadNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.authUser?.id;

    if (userId == null) {
      throw new Unauthorized(
        "You do not have permissions to perform this action"
      );
    }

    const unreadNotificationCount =
      await NotificationService.countUnreadNotifications({
        userId,
        read: false,
      });

    res.status(200).json({
      message: "Unread notifications count retrieved successfully",
      count: unreadNotificationCount,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.authUser?.id;

    if (userId == null) {
      throw new Unauthorized(
        "You do not have permissions to perform this action"
      );
    }

    await NotificationService.markAllAsRead(userId);

    res.status(200).json({
      message: "All notifications marked as read",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
