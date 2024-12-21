import express from 'express'
import { getMessagesController } from '~/controllers/message.controllers';
import { accessTokenValidation } from '~/middlewares/users.middlewares';
import { wrapRequestHandler } from '~/utils/handler';


const messageRouter = express.Router();


messageRouter.get('/',accessTokenValidation,wrapRequestHandler(getMessagesController))



export default messageRouter;