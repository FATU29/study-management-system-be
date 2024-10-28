import User from '~/models/schemas/user.schema'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import { RegisterReqBody } from '~/controllers/request/user.request'
import { signToken, verifyToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import RefreshToken from '~/models/schemas/refreshtoken.schema'
import * as process from 'node:process'
import { sendMail } from '~/utils/email'

class UsersService {
  async signAccessToken({ user_id, verify }: { user_id: string; verify?: number }) {
    return await signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        verify
      },
      privateKey: process.env.SECRECT_KEY_ACCESSTOKEN as string,
      options: {
        expiresIn: process.env.ACCESSTOKEN_EXPIRE
      }
    })
  }
  async signRefreshToken({ user_id, exp, verify }: { user_id: string; exp?: number; verify?: number }) {
    if (exp) {
      return await signToken({
        payload: {
          user_id,
          token_type: TokenType.RefreshToken,
          exp,
          verify
        },
        privateKey: process.env.SECRECT_KEY_REFRESHTOKEN as string
      })
    }
    return await signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify
      },
      privateKey: process.env.SECRECT_KEY_REFRESHTOKEN as string,
      options: {
        expiresIn: process.env.REFRESHTOKEN_EXPIRE
      }
    })
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId();
    const verifyEmailToken = await this.signVerifyEmailToken({user_id:String(user_id)});

    const domainNameForVerify = process.env.DOMAIN_NAME +'/users/verify-email?token='+verifyEmailToken;

    const msg = {
      to: payload.email,
      from: process.env.COMPANY_MAIL as string,
      subject:`Verify Registeration Acoount`,
      text: `Please click here to verify: ${verifyEmailToken}`,
      html: `<b>Please click here to verify:</b> 
      <a href="${domainNameForVerify}" style="color: #007bff; text-decoration: underline;">${domainNameForVerify}</a> `,
    }

    await sendMail(msg);
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        verify: UserVerifyStatus.Unverified
      })
    )
  }

  async signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify?: number }) {
    return await Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }

  async signVerifyEmailToken ({user_id}:{user_id:string}){
    return await signToken({
      payload:{
        user_id:user_id,
      },
      privateKey:process.env.SECRECT_KEY_VERIFYEMAIL as string,
      options:{
        expiresIn:process.env.EMAILVERIFY_EXPIRE as string
      }
    })
  }


  async decodeRefreshToken(refresh_token: string) {
    return await verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.SECRECT_KEY_REFRESHTOKEN as string
    })
  }

  async login({ user_id }: { user_id: string }) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken({
      user_id
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

  async checkEmailExist(email: string) {
    return await databaseService.users.findOne({ email })
  }

  async logout(refreshToken: string) {
    return await databaseService.refreshTokens.deleteOne({ token: refreshToken })
  }

  async verifyEmailService(user_id: ObjectId) {
    await databaseService.users.updateOne(
      { _id: user_id },
      {
        $set: { verify: UserVerifyStatus.Verified },
        $currentDate: { updated_at: true }
      }
    );
  }

  async sendAgainVerifyEmailService(user:User){
    const newTokenVerifyEmail = await usersService.signVerifyEmailToken({
      user_id: String(String(user._id))
    })

    console.log('Token verify email: ', newTokenVerifyEmail)
    console.log('Start sending email')

    const domainNameForVerify = process.env.DOMAIN_NAME +'/users/verify-email?token='+newTokenVerifyEmail;

    const msg = {
      to: user.email,
      from: process.env.COMPANY_MAIL as string,
      subject:`Verify Registeration Acoount`,
      text: `Please click here to verify: ${newTokenVerifyEmail}`,
      html: `<b>Please click here to verify:</b> 
      <a href="${domainNameForVerify}" style="color: #007bff; text-decoration: underline;">${domainNameForVerify}</a> `,
    }

    await sendMail(msg);
  }

}

const usersService = new UsersService()
export default usersService
