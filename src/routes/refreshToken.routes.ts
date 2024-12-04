import express from 'express'
import { wrapRequestHandler } from '~/utils/handler'
import { refreshTokenValidation } from '~/middlewares/users.middlewares'
import { newAccessTokenController } from '~/controllers/refreshToken.controllers'

const refreshTokenRouter = express.Router()

refreshTokenRouter.post('/', refreshTokenValidation, wrapRequestHandler(newAccessTokenController))

export default refreshTokenRouter
