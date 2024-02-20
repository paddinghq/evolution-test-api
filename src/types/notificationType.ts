import { Types } from "mongoose";

export default interface INotification {
  event?: Types.ObjectId;
  content: string;
  eventUrl?: string;
  id?: Types.ObjectId;
  title: string;
  notificationIcon: string;
  users: INotificationUser[];
  createdAt?: Date;
}

export interface INotificationUpdate {
  seen?: boolean;
  readAt?: Date;
}

export interface INotificationUser {
  _id: Types.ObjectId;
  email: string;
}

export interface UserNotification {
  notification: Types.ObjectId;
  read: boolean;
  readAt?: Date;
}
