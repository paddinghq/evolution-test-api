import NotificationService from "../services/notificationService";
import INotification from "../types/notificationType";

const triggerNotification = async (notification: INotification) => {
  try {
    await NotificationService.addNotification(notification);
  } catch (error: any) {
    console.log(error);
  }
};
export default triggerNotification;
