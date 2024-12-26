import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpstatus'
import databaseService from '~/services/database.services'
import messageService from '~/services/message.services'

export const getMessagesController = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.decoded_authorization
    const { receiverId } = req.body || ''
    const { page = 1, perPage = 6 } = req.query

    const response = await messageService.getMessages(user_id, new ObjectId(receiverId), Number(page), Number(perPage))
    const totalPage = await databaseService.messages.countDocuments({
      $or: [
        {
          senderId: user_id,
          receiverId: new ObjectId(receiverId)
        },
        {
          senderId: new ObjectId(receiverId),
          receiverId: user_id
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
    const arrayUser = await messageService.getReceiverDetail(user_id)

    res.json({
      message: 'getReciverId successfully',
      code: HTTP_STATUS.OK,
      data: arrayUser
    })
  } catch (error) {
    next(error)
  }
}
