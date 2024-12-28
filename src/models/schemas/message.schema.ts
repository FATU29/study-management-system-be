import { ObjectId } from "mongodb";



export interface TMessage {
    _id?: string,
    senderId: ObjectId,
    receiverId: ObjectId,
    content: string,
    isRead: boolean,
    created_at?: Date
    updated_at?: Date
}


export class Message {
    _id?: string
    senderId: ObjectId
    receiverId: ObjectId
    content: string
    isRead: boolean
    created_at?: Date
    updated_at?: Date

    constructor(m : TMessage) {
        this._id = m?._id
        this.senderId = m.senderId;
        this.receiverId = m.receiverId;
        this.content = m.content;
        this.isRead = m.isRead;
        this.created_at = m.created_at;
        this.updated_at = m.updated_at;
    }
}   