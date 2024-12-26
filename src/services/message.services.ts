import { ObjectId } from 'mongodb'
import databaseService from './database.services'

class MessageService {
  async getMessages(userId: ObjectId, receiverId: ObjectId, page: number = 1, perPage: number = 6) {
    let data
    if (page === -1 && perPage === -1) {
      data = await databaseService.messages
        .find({
          $or: [
            {
              senderId: userId,
              receiverId: receiverId
            },
            {
              senderId: receiverId,
              receiverId: userId
            }
          ]
        })
        .toArray()
    } else {
      data = await databaseService.messages
        .find({
          $or: [
            {
              senderId: userId,
              receiverId: receiverId
            },
            {
              senderId: receiverId,
              receiverId: userId
            }
          ]
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .toArray()
    }

    return data
  }

  async getReceiverDetail(myId: ObjectId, content?: string) {
    let data = null
    if (content === '' || !content) {
      data = await databaseService.messages.aggregate([
        {
          $match: {
            $or: [{ sender_id: myId }, { receiver_id: myId }]
          }
        },
        {
          $group: {
            _id: {
              $cond: {
                if: { $eq: ['$sender_id', myId] },
                then: '$receiver_id',
                else: '$sender_id'
              }
            },
            lastMessage: { $last: '$$ROOT' }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user_info'
          }
        },
        {
          $unwind: '$user_info'
        },
        {
          $project: {
            _id: '$user_info._id',
            name: '$user_info.name',
            email: '$user_info.email',
            avatar: '$user_info.avatar',
            last_message: '$lastMessage.content',
            created_at: '$lastMessage.created_at'
          }
        },
        {
          $sort: { created_at: -1 }
        }
      ])
    } else {
      data = await databaseService.messages.aggregate([
        {
          $match: {
            $or: [{ sender_id: myId }, { receiver_id: myId }]
          }
        },
        {
          $group: {
            _id: {
              $cond: {
                if: { $eq: ['$sender_id', myId] },
                then: '$receiver_id',
                else: '$sender_id'
              }
            },
            lastMessage: { $last: '$$ROOT' }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user_info'
          }
        },
        {
          $unwind: '$user_info'
        },
        {
          $match: {
            $or: [
              { 'user_info.name': { $regex: content, $options: 'i' } },
              { 'user_info.email': { $regex: content, $options: 'i' } }
            ]
          }
        },
        {
          $project: {
            _id: '$user_info._id',
            name: '$user_info.name',
            email: '$user_info.email',
            avatar: '$user_info.avatar',
            last_message: '$lastMessage.content',
            created_at: '$lastMessage.created_at'
          }
        },
        {
          $sort: { created_at: -1 }
        }
      ])
    }

    return data
  }
}

const messageService = new MessageService()
export default messageService
