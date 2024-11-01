
import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import User from '~/models/schemas/user.schema'
import { ObjectId } from 'mongodb'

export interface RegisterReqBody {
  email: string
  password: string
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface TokenPayload extends JwtPayload {
    user_id: ObjectId
    token_type: TokenType
    verify?: UserVerifyStatus
    exp: number
    iat: number
  }


export interface LogoutReqBody {
  refreshToken:string,
}

export interface UpdateProfileRequest{
  firstname?:string,
  lastname?:string,
  dateOfBirth?:Date,
  avatar?:string,
}