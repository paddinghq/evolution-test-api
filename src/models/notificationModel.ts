import { model, Schema } from "mongoose";
import INotification from "../types/notificationType";

const notificationSchema = new Schema<INotification>(
  {
    event: Schema.Types.ObjectId,
    content: String,
    eventUrl: String,
    readAt: Date,
    title: String,
    notificationIcon: String,
    userId: Schema.Types.ObjectId,
    // userType: String,
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const NotificationModel = model<INotification>(
  "Notification",
  notificationSchema
);
