import { NotificationModel } from "../models/notificationModel";
import INotification from "../types/notificationType";
import { Types } from "mongoose";

export default class NotificationService {
  static async addNotification(data: INotification) {
    return await NotificationModel.create(data);
  }

  static async getNotifications() {
    return await NotificationModel.find()
  }

  static async countUnreadNotifications(options: Record<string, any>) {
    return await NotificationModel.find(options).countDocuments();
  }

  static async getNotification(id: string | Types.ObjectId) {
    return await NotificationModel.findById(id);
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