import { model, Schema, Types } from "mongoose";
import INotification from "../types/notificationType";
import { UserModel } from "./userModel";

export const notificationSchema = new Schema<INotification>(
  {
    event: Schema.Types.ObjectId,
    content: String,
    eventUrl: String,
    title: String,
    notificationIcon: String,
    users: [
      {
        email: String,
        _id: Types.ObjectId,
      },
    ],
  },
  { timestamps: true },
);

notificationSchema.post("findOneAndDelete", async function () {
  const notificationId = this.getFilter()["_id"];

  await UserModel.updateMany(
    {},
    { $pull: { notifications: { notification: notificationId } } },
  );
});

export const NotificationModel = model<INotification>(
  "Notification",
  notificationSchema,
);
