import { Notification } from "~/models/schemas/notification.schema";
import databaseService from "~/services/database.services";
import { ObjectId } from "mongodb";
import { NotificationRequest } from "../controllers/request/notification.request";

class NotificationsServices {
  async createNotification(notification: Notification) {
    return await databaseService.notifications.insertOne(notification);
  }

  // get all notification by userId
  async getNotification(userId: string) {
    return await databaseService.notifications.find({ userId: userId }).toArray();
  }



  async updateNotification(_id: ObjectId, data: NotificationRequest) {
    return await databaseService.notifications.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          ...data,
        },
        $currentDate: {
          updated_at: true,
        },
      },
      {
        returnDocument: "after",
      }
    );
  }

  async deleteNotification(_id: ObjectId) {
    return await databaseService.notifications.deleteOne({ _id: _id });
  }
}

const notificationServices = new NotificationsServices();
export default notificationServices;