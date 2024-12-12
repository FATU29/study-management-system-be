import { Notification } from "~/models/schemas/notification.schema";
import databaseService from "~/services/database.services";
import { ObjectId } from "mongodb";
import { NotificationRequest } from "../controllers/request/notification.request";

class NotificationsServices {
  async createNotification(notification: Notification) {
    return await databaseService.notifications.insertOne(notification);
  }

  // get notification paging by userId
  async getNotification(userId: string, options: { 
    page?: number; 
    limit?: number; 
  } = {}) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;
  
  
    // Get total count of notifications for this user
    const totalCount = await databaseService.notifications.countDocuments({ 
      userId: userId 
    });
  
    // Fetch paginated notifications
    const notifications = await databaseService.notifications
      .find({ userId: userId })
      .skip(skip)
      .limit(limit)
      .toArray();
  
    return {
      notifications,
      pagination: {
        currentPage: page,
        itemsPerPage: limit,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
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