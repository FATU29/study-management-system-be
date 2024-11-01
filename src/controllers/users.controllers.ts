import { Request, Response } from 'express'
import usersService from '~/services/users.services'
import {
  LoginReqBody,
  LogoutReqBody,
  PasswordRequest,
  RegisterReqBody,
  TokenPayload,
  UpdateProfileRequest,
  ChangePasswordRequest
} from './request/user.request'
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
import UsersServices from '~/services/users.services'

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
  const user_id = new ObjectId(decoded_verify_email_token.user_id)

  const user = await databaseService.users.findOne({ _id: user_id })

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
  await usersService.sendAgainVerifyEmailService(user)

  res.json({
    message: 'Resend Verify-Email-Token Successfully'
  })
}

export const forgotPasswordController = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { user } = req

  const forgotPasswordToken = await usersService.forgotPasswordService(user)

  res.json({
    message: 'Send Verify-Forgot-Password Successfully'
  })
}

export const resetPasswordController = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  return res.json({
    user_id: req.decoded_verify_forgot_password_token.user_id,
    message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
  }) as any
}

export const getMeController = async (req: Request<ParamsDictionary, any, any>, res: Response) => {
  const decoded: TokenPayload = req.decoded_authorization
  const id = new ObjectId(decoded?.user_id)
  if (id) {
    const user = await usersServices.getDetailUser(id)
    res.json({
      data: user
    })
  } else {
    res.json({
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
}

export const updateProfileController = async (
  req: Request<ParamsDictionary, any, UpdateProfileRequest>,
  res: Response
) => {
  const decoded = req.decoded_authorization
  const id = new ObjectId(decoded.user_id)
  const data = req.body
  const document = await UsersServices.updateProfileService(id, data)
  if (!document) {
    res.json({
      message: 'Update failed'
    })
  } else {
    res.json({
      message: 'Update successfully'
    })
  }
}

export const passwordController = async (req: Request<ParamsDictionary, any, PasswordRequest>, res: Response) => {
  const { password, user_id } = req.body
  const result = await usersService.passwordService(new ObjectId(user_id), password)

  return res.json({
    message: 'Change password successfully'
  }) as any
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordRequest>,
  res: Response
) => {
  const { newPassword } = req.body
  const { _id } = req.user

  const result = await usersService.passwordService(_id, newPassword)

  return res.json({
    message: 'Change password successfully'
  }) as any
}
