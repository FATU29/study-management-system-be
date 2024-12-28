import { ObjectId } from 'mongodb'
import databaseService from './database.services'

class MessageService {
  async getMessages(userId: ObjectId, receiverId: string, page: number = 1, perPage: number = 6, content?: string) {
    const receiverObjectId = new ObjectId(receiverId)
    let data

    if (page === -1 && perPage === -1) {
      data = await databaseService.messages
        .find({
          $or: [
            {
              senderId: userId,
              receiverId: receiverObjectId
            },
            {
              senderId: receiverObjectId,
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
              receiverId: receiverObjectId
            },
            {
              senderId: receiverObjectId,
              receiverId: userId
            }
          ]
        })
        .sort({ created_at: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .toArray()
    }

    return data
  }

  async getReceiverDetail(myId: ObjectId, content?: string) {
    let data = null
    if (!content) {
      data = await databaseService.messages
        .aggregate([
          {
            $match: {
              $or: [{ senderId: myId }, { receiverId: myId }]
            }
          },
          {
            $group: {
              _id: {
                $cond: {
                  if: { $eq: ['$senderId', myId] },
                  then: '$receiverId',
                  else: '$senderId'
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
              firstName: '$user_info.firstName',
              lastName: '$user_info.lastName',
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
        .toArray()
    } else {
      data = await databaseService.users
        .find({
          $or: [
            {
              firstName: {
                $regex: content,
                $options: 'i'
              }
            },
            {
              lastName: {
                $regex: content,
                $options: 'i'
              }
            },
            {
              email: {
                $regex: content,
                $options: 'i'
              }
            }
          ]
        })
        .project({ password: 0 })
        .toArray()
    }

    return data
  }
}

const messageService = new MessageService()
export default messageService
