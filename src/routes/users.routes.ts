import express from 'express'
import {
  forgotPasswordController,
  loginController,
  logoutController,
  registerController,
  resetPasswordController,
  sendAgainVerifyEmailController,
  verifyEmailController,
  getMeController,
  updateProfileController,
  passwordController,
  changePasswordController
} from '~/controllers/users.controllers'
import {
  accessTokenValidation,
  loginValidation,
  refreshTokenValidation,
  registerValidation,
  sendAgainVerifyEmailValidation,
  verifyEmailValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  updateProfileValidation,
  passwordValidation,
  changeNewPasswordEmailValidation,
  changeNewPasswordValidation
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
usersRouter.get('/reset-password',resetPasswordValidation,wrapRequestHandler(resetPasswordController))
usersRouter.post('/forgot-password',forgotPasswordValidation,wrapRequestHandler(forgotPasswordController));
usersRouter.get('/get-me',accessTokenValidation,wrapRequestHandler(getMeController));
usersRouter.patch('/update-profile',accessTokenValidation,updateProfileValidation,wrapRequestHandler(updateProfileController))
usersRouter.post('/password',passwordValidation,wrapRequestHandler(passwordController));
usersRouter.post('/change-password',changeNewPasswordEmailValidation,changeNewPasswordValidation,wrapRequestHandler(changePasswordController));

export default usersRouter
