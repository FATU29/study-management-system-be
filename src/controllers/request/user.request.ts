
import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import User from '~/models/schemas/user.schema'

export interface RegisterReqBody {
  email: string
  password: string
}

export interface LoginReqBody {
  email: string
  password: string
}






export interface TokenPayload extends JwtPayload {
    user_id: string
    token_type: TokenType
    verify: UserVerifyStatus
    exp: number
    iat: number
  }