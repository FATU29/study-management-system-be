import { Request, Response } from 'express'
import usersService from '~/services/users.services'
import { LoginReqBody, LogoutReqBody, RegisterReqBody } from './request/user.request'
import { USERS_MESSAGES } from '~/constants/message'
import { ObjectId } from 'mongodb'
import { ParamsDictionary } from 'express-serve-static-core'
import User from '~/models/schemas/user.schema'
import { hashBcrypt } from '~/utils/crypto'
import usersServices from '~/services/users.services'
import databaseService from '~/services/database.services'
import { UserVerifyStatus } from '~/constants/enum'
import process from 'node:process'
import { sendMail } from '~/utils/email'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const { email, password } = req.body
  const hashedPassword = await hashBcrypt(password)
  const result = await usersService.register({ email: email, password: hashedPassword })
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  }) as any
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login({ user_id: user_id.toString() })
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  }) as any
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refreshToken } = req.body

  await usersService.logout(refreshToken)

  return res.json({
    message: USERS_MESSAGES.LOGOUT_SUCCESS
  }) as any
}

export const verifyEmailController = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { decoded_verify_email_token } = req
  console.log(decoded_verify_email_token)
  const user_id = new ObjectId(decoded_verify_email_token.user_id)

  const user = await databaseService.users.findOne({ _id: user_id })

  console.log(user)

  if (user === null) {
    return res.json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }

  if (user?.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }

  await usersService.verifyEmailService(user_id)

  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS
  }) as any
}

export const sendAgainVerifyEmailController = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { user } = req
  await usersService.sendAgainVerifyEmailService(user);

  res.json({
    message: 'Resend Verify-Email-Token Successfully'
  })
}
