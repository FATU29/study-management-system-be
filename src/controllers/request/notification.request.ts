import exp from 'constants';
import {ObjectId} from 'mongodb';


export interface NotificationRequest {

    _id?: ObjectId;
  
    title?: string;
  
    description?: string;
  
    userId?: string;
  
    read?: boolean;
  
  }
export interface GetNotificationRequest{
    _id:ObjectId
}