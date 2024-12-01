import { ObjectId } from 'mongodb'

export interface INotification {
  _id?:ObjectId,
  title:string,
  content:string,
  userId:string,
  isRead:boolean
}

export class Notification {
  _id?:ObjectId
  title:string
  content:string
  userId:string
  isRead:boolean

  constructor(notification:INotification) {
    this._id = notification._id
    this.title = notification.title
    this.content = notification.content
    this.userId = notification.userId
    this.isRead = notification.isRead
  }
}