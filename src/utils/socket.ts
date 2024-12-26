import { DefaultEventsMap, Server } from 'socket.io'
import databaseService from '~/services/database.services'
import { verifyToken } from './jwt'
import { TokenPayload } from '~/controllers/request/user.request'
import { ObjectId } from 'mongodb'
import { Message } from '~/models/schemas/message.schema'

export const initSocket = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  const socketId = new Map<ObjectId, string>()

  io.use(async (socket, next) => {
    try {
      const { accessToken } = socket.handshake.auth
      const decoded_authorization = await verifyToken({
        token: accessToken,
        secretOrPublicKey: String(process.env.SECRECT_KEY_ACCESSTOKEN)
      })
      socket.handshake.auth.decoded_authorization = decoded_authorization
      next()
    } catch (error) {
      console.error('Authentication error:', error)
      next({
        message: 'error in authen socket',
        name: 'Unthorize',
        data: error
      })
    }
  })

  io.on('connection', (socket) => {
    try {
      const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload
      socketId.set(user_id, socket.id)
      console.log(user_id,"conected:",socket.id)

      socket.on('send-from-client', async (data) => {
        if (!data?.to || !data?.content) {
          throw new Error('Invalid message data')
        }


        const receiverSocketId = socketId.get(data.to)

        const message = await databaseService.messages.insertOne(
          new Message({
            senderId: user_id,
            receiverId: data.to,
            content: data.content,
            isRead: false
          })
        )

        if (receiverSocketId) {
          socket.to(receiverSocketId).emit('send-from-server', {
            content: data.content,
            to: data.to,
            from: user_id,
            messageId: message.insertedId
          })
        }
      })

      socket.on('disconnect', () => {
        try {
          socketId.delete(user_id)
        } catch (error) {
          console.error('Error handling disconnect:', error)
        }
      })
    } catch (error) {
      socket.disconnect(true)
    }
  })
}
