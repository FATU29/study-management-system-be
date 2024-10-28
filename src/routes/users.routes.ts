import express from 'express'
import {
  loginController,
  logoutController,
  registerController,
  sendAgainVerifyEmailController,
  verifyEmailController
} from '~/controllers/users.controllers'
import {
  accessTokenValidation,
  loginValidation,
  refreshTokenValidation,
  registerValidation,
  sendAgainVerifyEmailValidation,
  verifyEmailValidation
} from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const usersRouter = express.Router()

usersRouter.post('/login', loginValidation, wrapRequestHandler(loginController))
usersRouter.post('/register', registerValidation, wrapRequestHandler(registerController))
usersRouter.post('/logout', accessTokenValidation, refreshTokenValidation, wrapRequestHandler(logoutController))
usersRouter.get('/verify-email', verifyEmailValidation, wrapRequestHandler(verifyEmailController))
usersRouter.post(
  '/send-again-verify-email',
  sendAgainVerifyEmailValidation,
  wrapRequestHandler(sendAgainVerifyEmailController)
)

export default usersRouter
