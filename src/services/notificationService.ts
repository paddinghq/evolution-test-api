import { NotificationModel } from "../models/notificationModel";
import { UserModel } from "../models/userModel";
import INotification from "../types/notificationType";
import { Types } from "mongoose";
import { IUser } from "../types/types";

export default class NotificationService {
  static async addNotification(data: INotification) {
    return await NotificationModel.create(data);
  }

  static async getNotifications(user: IUser) {
    await user.populate("notifications.notification", "-__v -users");

    return user.notifications;
  }

  static async countUnreadNotifications(user: IUser) {
    const unreadNotifications = user.notifications.filter(
      (n) => n.read === false
    );
    return unreadNotifications.length;
  }

  static async getNotification(
    notificationId: string | Types.ObjectId,
    user: IUser
  ) {
    await user.populate({
      path: "notifications.notification",
      select: "-__v -users",
      match: { _id: notificationId },
    });

    // Find the notification index
    const notificationIndex = user.notifications.findIndex(
      (n) => n.notification?._id == notificationId
    );
    if (notificationIndex === -1) {
      return null;
    }

    if (user.notifications[notificationIndex].read !== true) {
      user.notifications[notificationIndex].read = true;
      user.notifications[notificationIndex].readAt = new Date();
      const updatedUser = await user.save();
      user = updatedUser;
    }

    return user.notifications[notificationIndex];
  }

  static async markAsRead(
    user: IUser,
    notificationId: string | Types.ObjectId
  ) {
    await user.populate({
      path: "notifications.notification",
      select: "-__v -users",
      match: { _id: notificationId },
    });

    // Find the notification index
    const notificationIndex = user.notifications.findIndex(
      (n) => n.notification?._id == notificationId
    );

    if (notificationIndex === -1) {
      return null;
    }
    if (user.notifications[notificationIndex].read !== true) {
      user.notifications[notificationIndex].read = true;
      user.notifications[notificationIndex].readAt = new Date();
      await user.save();
    }

    return "done";
  }

  static async markAllAsRead(user: IUser) {
    // Filter notifications where read is false
    const notificationsToMarkAsRead = user.notifications.filter(
      (notification) => !notification.read
    );

    // Update read and readAt for filtered notifications
    notificationsToMarkAsRead.forEach((notification) => {
      notification.read = true;
      notification.readAt = new Date();
    });

    await user.save();
  }

  static async updateNotification(
    id: string | Types.ObjectId,
    data: Record<string, any>
  ) {
    return await NotificationModel.findByIdAndUpdate(id, data, {
      useFindAndModify: false,
      new: true,
    });
  }

  static async removeNotification(id: string | Types.ObjectId) {
    return await NotificationModel.findByIdAndDelete(id);
  }
}
