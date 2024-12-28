import { DefaultEventsMap, Server } from 'socket.io';
import databaseService from '~/services/database.services';
import { verifyToken } from './jwt';
import { TokenPayload } from '~/controllers/request/user.request';
import { ObjectId } from 'mongodb';
import { Message } from '~/models/schemas/message.schema';

export const initSocket = (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  const socketIdMap = new Map<ObjectId, string>();

  io.use(async (socket, next) => {
    try {
      const { accessToken } = socket.handshake.auth;
      const decodedAuthorization = await verifyToken({
        token: accessToken,
        secretOrPublicKey: String(process.env.SECRECT_KEY_ACCESSTOKEN),
      });

      socket.handshake.auth.decodedAuthorization = decodedAuthorization;
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      next(new Error('Unauthorized')); 
    }
  });

  io.on('connection', (socket) => {
    try {
      const { user_id } = socket.handshake.auth.decodedAuthorization as TokenPayload;
      socketIdMap.set(user_id, socket.id);
      
  
      io.emit('online-users', Array.from(socketIdMap.keys()));
      console.log(`User connected: ${user_id}, Socket ID: ${socket.id}`);

      
      socket.on('send-from-client', async (data) => {
        try {
          if (!data?.to || !data?.content) {
            throw new Error('Invalid message data');
          }

          const receiverSocketId = socketIdMap.get(data.to);

          const message = await databaseService.messages.insertOne(
            new Message({
              senderId: new ObjectId(user_id),
              receiverId: new ObjectId(data.to),
              content: data.content,
              isRead: false,
              created_at: new Date(),
            })
          );

          if (receiverSocketId) {
            socket.to(receiverSocketId).emit('send-from-server', {
              content: data.content,
              to: data.to,
              from: user_id,
              messageId: message.insertedId,
              created_at: new Date(),
            });
          }
        } catch (error) {
          console.error('Error handling message:', error);
        }
      });

    
      socket.on('disconnect', () => {
        try {
          socketIdMap.delete(user_id);
          
         
          io.emit('online-users', Array.from(socketIdMap.keys()));
          console.log(`User disconnected: ${user_id}`);
        } catch (error) {
          console.error('Error handling disconnect:', error);
        }
      });
    } catch (error) {
      console.error('Error during connection setup:', error);
      socket.disconnect(true);
    }
  });
};
