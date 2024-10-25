import User from '~/models/schemas/user.schema'
import databaseService from './database.services'
import { hashBcrypt } from '~/utils/crypto'
import { ObjectId } from 'mongodb'
import { RegisterReqBody } from '~/controllers/request/user.request'
import { signToken, verifyToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enum'
import RefreshToken from '~/models/schemas/refreshtoken.schema'

class UsersService {

  private signAccessToken({ user_id }: { user_id: string }) {
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        
      },
      privateKey: process.env.SECRECT_KEY_ACCESSTOKEN as string,
      options: {
        expiresIn: process.env.ACCESSTOKEN_EXPIRE
      }
    })
  }
  private signRefreshToken({ user_id, exp }: { user_id: string; exp?: number }) {
    if (exp) {
      return signToken({
        payload: {
          user_id,
          token_type: TokenType.RefreshToken,
          exp
        },
        privateKey: process.env.SECRECT_KEY_REFRESHTOKEN as string
      })
    }
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
      },
      privateKey: process.env.SECRECT_KEY_REFRESHTOKEN as string,
      options: {
        expiresIn: process.env.REFRESHTOKEN_EXPIRE
      }
    })
  }



  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
      })
    )
  }


  private signAccessAndRefreshToken({ user_id }: { user_id: string }) {
    return Promise.all([this.signAccessToken({ user_id }), this.signRefreshToken({ user_id })])
  }

  private decodeRefreshToken(refresh_token: string) {
    return verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.SECRECT_KEY_REFRESHTOKEN  as string
    })
  }


  async login({ user_id }: { user_id: string}) {
    
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id,
    })
    const { iat, exp } = await this.decodeRefreshToken(refresh_token)

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, iat, exp })
    )
    return {
      access_token,
      refresh_token
    }
  }

    async checkEmailExist(email:string){
       const result = await databaseService.users.findOne({email});
       return Boolean(result);
    }

    async logout(refreshToken:string){
      await databaseService.refreshTokens.deleteOne({token:refreshToken});
    
    }
  }

const usersService = new UsersService()
export default usersService
