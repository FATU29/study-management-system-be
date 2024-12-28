import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpstatus'
import databaseService from '~/services/database.services'
import messageService from '~/services/message.services'

export const getMessagesController = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.decoded_authorization
    const { page = 1, perPage = 6, receiverId } = req.query
    const toObjectIdReceiver =  new ObjectId(receiverId as string)
    const toObjectIdUser = new ObjectId(user_id)
    
    const response = await messageService.getMessages(toObjectIdUser, String(receiverId), Number(page), Number(perPage))
    const totalPage = await databaseService.messages.countDocuments({
      $or: [
        {
          senderId: toObjectIdUser,
          receiverId: toObjectIdReceiver
        },
        {
          senderId: toObjectIdReceiver,
          receiverId: toObjectIdUser
        }
      ]
    })

    res.status(HTTP_STATUS.CREATED).json({
      code: HTTP_STATUS.CREATED,
      message: 'send email successfully',
      data: {
        page,
        perPage,
        totalPage,
        data: response
      }
    })
  } catch (error) {
    throw error
  }
}

export const getReceiverController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user_id } = req.decoded_authorization
    const {content} = req.query
    const arrayUser = await messageService.getReceiverDetail(new ObjectId(user_id),content as string)

    res.json({
      message: 'getReciverId successfully',
      code: HTTP_STATUS.OK,
      data: arrayUser
    })
  } catch (error) {
    next(error)
  }
}
