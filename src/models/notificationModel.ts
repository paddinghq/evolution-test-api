import { model, PaginateModel, Schema, Types } from "mongoose";
import INotification from "../types/notificationType";
import { UserModel } from "./userModel";
import paginate from "mongoose-paginate-v2";

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

notificationSchema.plugin(paginate);


notificationSchema.post("findOneAndDelete", async function () {
  const notificationId = this.getFilter()["_id"];

  await UserModel.updateMany(
    {},
    { $pull: { notifications: { notification: notificationId } } },
  );
});

export const NotificationModel = model<INotification, PaginateModel<INotification>>(
  "Notification",
  notificationSchema,
);
