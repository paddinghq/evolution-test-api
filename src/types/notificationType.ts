import { Types } from "mongoose";

export default interface INotification {
  event?: Types.ObjectId;
  content: string;
  eventUrl?: string;
  readAt?: Date;
  id?: Types.ObjectId;
  title: string;
  notificationIcon: string;
  userId: Types.ObjectId;
  read?: Boolean;
  createdAt?: Date;
}

export interface INotificationUpdate {
  seen?: boolean;
  readAt?: Date;
}
