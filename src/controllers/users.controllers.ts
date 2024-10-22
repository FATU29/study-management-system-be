import { NextFunction, Request, Response } from 'express'
import usersService from '~/services/users.services'
import { LoginReqBody, RegisterReqBody } from './request/user.request'
import { USERS_MESSAGES } from '~/constants/message'
import { ObjectId } from 'mongodb'
import { ParamsDictionary } from 'express-serve-static-core'
import User from '~/models/schemas/user.schema'
import { hashBcrypt } from '~/utils/crypto'


export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body
  const hashedPassword = await hashBcrypt(password)
  const result = await usersService.register({email,password:hashedPassword})
  return await res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  }) as any 
}

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login({ user_id: user_id.toString() })
  return await res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  }) as any
}
