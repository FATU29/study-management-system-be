import express from 'express'
import { loginController, registerController } from '~/controllers/users.controllers'
import { loginValidation, registerValidation } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handler'

const usersRouter = express.Router()

usersRouter.post('/login', loginValidation, wrapRequestHandler(loginController))
usersRouter.post('/register', registerValidation, wrapRequestHandler(registerController))

export default usersRouter
