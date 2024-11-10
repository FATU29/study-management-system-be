import jwt, { SignOptions } from 'jsonwebtoken'
import { TokenPayload } from '~/controllers/request/user.request'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpstatus'



export const signToken = ({
  payload,
  privateKey,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) {
        throw reject(error)
      }
      resolve(token as string)
    })
  })
}

export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        throw new ErrorWithStatus({
          message: error.message,
          status:HTTP_STATUS.UNAUTHORIZED
        })
      }
      resolve(decoded as TokenPayload)
    })
  })
}
