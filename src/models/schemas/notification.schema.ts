import { ObjectId } from 'mongodb'

export interface INotification {
  _id?:ObjectId,
  title:string,
  content:string,
  userId:string,
  courseId:string,
  isRead:boolean,
  time:Date
}

export class Notification {
  _id?:ObjectId
  title:string
  content:string
  userId:string
  isRead:boolean
  courseId:string
  time:Date

  constructor(notification:INotification) {
    this._id = notification._id
    this.title = notification.title
    this.content = notification.content
    this.userId = notification.userId
    this.isRead = notification.isRead
    this.courseId = notification.courseId
    this.time = notification.time
  }
}