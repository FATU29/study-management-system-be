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
import UsersServices from '~/services/users.services'
import HTTP_STATUS from '~/constants/httpstatus'
import process from 'node:process'

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const { email, password , lastName ,firstName } = req.body
  const hashedPassword = await hashBcrypt(password)
  await usersService.register({ email: email, password: hashedPassword , lastName,firstName })
  res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    status: HTTP_STATUS.CREATED
  })
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const role = user.role
  const result = await usersService.login(user)
  res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    status: HTTP_STATUS.OK,
    data: {
      result,
      user
    }
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  const { refreshToken } = req.body

  await usersService.logout(refreshToken)

  res.json({
    message: USERS_MESSAGES.LOGOUT_SUCCESS,
    status: HTTP_STATUS.OK
  })
}

export const verifyEmailController = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { decoded_verify_email_token } = req
  const user_id = new ObjectId(decoded_verify_email_token.user_id)

  const user = await databaseService.users.findOne({ _id: user_id })

  if (user === null) {
    res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      message: USERS_MESSAGES.USER_NOT_FOUND,
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY
    })
  }

  if (user?.verify === UserVerifyStatus.Verified) {
    res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE,
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY
    })
  }

  await usersService.verifyEmailService(user_id)

  res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    status: HTTP_STATUS.OK
  })
}

export const sendAgainVerifyEmailController = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { user } = req
  await usersService.sendAgainVerifyEmailService(user)

  res.json({
    message: 'Resend Verify-Email-Token Successfully',
    status: HTTP_STATUS.OK
  })
}

export const forgotPasswordController = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  const { user } = req
  await usersService.forgotPasswordService(user)
  res.json({
    message: 'Send Verify-Forgot-Password Successfully',
    status: HTTP_STATUS.OK
  })
}

export const resetPasswordController = async (req: Request<ParamsDictionary, any, any, any>, res: Response) => {
  res.json({
    data: {
      user_id: req.decoded_verify_forgot_password_token.user_id
    },
    status: HTTP_STATUS.OK,
    message: USERS_MESSAGES.RESET_PASSWORD_SUCCESS
  })
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
      message: USERS_MESSAGES.USER_NOT_FOUND,
      status: HTTP_STATUS.OK
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
  await UsersServices.updateProfileService(id, data)
  res.json({
    message: 'Update successfully',
    status: HTTP_STATUS.OK
  })
}

export const passwordController = async (req: Request<ParamsDictionary, any, PasswordRequest>, res: Response) => {
  const { password, user_id } = req.body
  await usersService.passwordService(new ObjectId(user_id), password)
  res.json({
    message: 'Change password successfully',
    status: HTTP_STATUS.OK
  })
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordRequest>,
  res: Response
) => {
  const { newPassword } = req.body
  const { _id } = req.user
  const id = new ObjectId(_id)
  await usersService.passwordService(id, newPassword)
  res.json({
    message: 'Change password successfully',
    status: HTTP_STATUS.OK
  })
}

export const oauthController = async (req: Request<any, any, any>, res: Response) => {
  const { code } = req.query
  const tokens = await usersService.oauthService(code as string)

  if(tokens){
    const url = process.env.CLIENT_REDIRECT_URL_GOOGLE
    res.redirect(`${url}?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
  } else {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Login By Google Fail',
      status: HTTP_STATUS.BAD_REQUEST,
      data: null
    })
  }
}
