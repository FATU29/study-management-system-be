import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import { ObjectId } from 'mongodb'

export interface RegisterReqBody {
  email: string
  password: string
  lastName: string
  firstName: string
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface TokenPayload extends JwtPayload {
  user_id: ObjectId
  token_type: TokenType
  role:string
  verify?: UserVerifyStatus
  exp: number
  iat: number
}

export interface LogoutReqBody {
  refreshToken: string
}

export interface UpdateProfileRequest {
  firstname?: string
  lastname?: string
  dateOfBirth?: Date
  avatar?: string
}

export interface PasswordRequest {
  password: string
  user_id: string
}

export interface ChangePasswordRequest {
  email: string
  oldPassword: string
  newPassword: string
  confirmNewPassword: string
}


