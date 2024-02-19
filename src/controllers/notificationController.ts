import { Request, Response, NextFunction } from "express";
import NotificationService from "../services/notificationService";
import { ResourceNotFound, Unauthorized } from "../middlewares/errorHandler";

export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authUser = req.authUser;
    if (authUser == null) {
      throw new Unauthorized(
        "You do not have permissions to perform this action",
      );
    }

    const notifications = await NotificationService.getNotifications(authUser);

    if (notifications == null) {
      throw new ResourceNotFound("You have no notifications");
    }

    res.status(200).json({
      message:
        notifications.length > 0
          ? "Notifications retrieved successfully"
          : "You have no notifications",
      body: notifications,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
};

// get notification by id
export const getNotification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const notificationId = req.params.id;

    if (notificationId == null || notificationId == "") {
      throw new ResourceNotFound("Notification id is required");
    }

    const authUser = req.authUser;
    if (authUser == null) {
      throw new Unauthorized(
        "You do not have permissions to perform this action",
      );
    }

    const notification = await NotificationService.getNotification(
      notificationId,
      authUser,
    );

    if (notification == null) {
      throw new ResourceNotFound("Notification not found");
    }

    res.status(200).json({
      message: "Notification retrieved successfully",
      body: notification,
      success: true,
    });
  } catch (error: any) {
    next(error);
  }
};

// Remove notification: only admin can remove notification??
export const removeNotification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const notification = req.params.id;

    const removedNotification =
      await NotificationService.removeNotification(notification);

    res.status(200).json({
      message: removedNotification
        ? "Notification removed successfully"
        : "You have no notifications",
      body: removedNotification,
      success: removedNotification ? true : false,
    });
  } catch (error: any) {
    next(error);
  }
};

export const countUnreadNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authUser = req.authUser;
    if (authUser == null) {
      throw new Unauthorized(
        "You do not have permissions to perform this action",
      );
    }

    const unreadNotificationCount =
      await NotificationService.countUnreadNotifications(authUser);

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
  next: NextFunction,
) => {
  try {
    const authUser = req.authUser;

    if (authUser == null) {
      throw new Unauthorized(
        "You do not have permissions to perform this action",
      );
    }

    await NotificationService.markAllAsRead(authUser);
    res.status(200).json({
      message: "All notifications marked as read",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authUser = req.authUser;
    if (authUser == null) {
      throw new Unauthorized(
        "You do not have permissions to perform this action",
      );
    }

    const notificationId = req.params.id;

    if (notificationId == null || notificationId == "") {
      throw new ResourceNotFound("Notification id is required");
    }

    const userId = authUser.id;

    await NotificationService.markAsRead(userId, notificationId);
    res.status(200).json({
      message: "Notification marked as read",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
