import express from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.controllers'
import { acccessTokenValidation, loginValidation, refreshTokenValidation, registerValidation } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const usersRouter = express.Router()

usersRouter.post('/login', loginValidation, wrapRequestHandler(loginController))
usersRouter.post('/register', registerValidation, wrapRequestHandler(registerController))
usersRouter.post('/logout',acccessTokenValidation,refreshTokenValidation,wrapRequestHandler(logoutController));

export default usersRouter
