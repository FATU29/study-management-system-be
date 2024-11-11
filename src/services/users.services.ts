import User from '~/models/schemas/user.schema'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import { RegisterReqBody, UpdateProfileRequest } from '~/controllers/request/user.request'
import { signToken, verifyToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import RefreshToken from '~/models/schemas/refreshtoken.schema'
import * as process from 'node:process'
import { sendMail } from '~/utils/email'
import { passwordController } from '~/controllers/users.controllers'
import { hashBcrypt } from '~/utils/crypto'

class UsersService {
  async signAccessToken({ user_id, verify }: { user_id: string; verify?: number }) {
    try {
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
    } catch (error) {
      throw error
    }
  }

  async signRefreshToken({ user_id, exp, verify }: { user_id: string; exp?: number; verify?: number }) {
    try {
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
    } catch (error) {
      throw error
    }
  }

  async register(payload: RegisterReqBody) {
    try {
      const user_id = new ObjectId()
      const verifyEmailToken = await this.signVerifyEmailToken({ user_id: String(user_id) })

      const domainNameForVerify = process.env.DOMAIN_NAME + '/users/verify-email?token=' + verifyEmailToken

      // const msg = {
      //   to: payload.email,
      //   from: process.env.COMPANY_MAIL as string,
      //   subject:`Verify Registeration Acoount`,
      //   text: `Please click here to verify: ${verifyEmailToken}`,
      //   html: `<b>Please click here to verify:</b>
      //   <a href="${domainNameForVerify}" style="color: #007bff; text-decoration: underline;">${domainNameForVerify}</a> `,
      // }
      //
      // await sendMail(msg);
      await databaseService.users.insertOne(
        new User({
          ...payload,
          _id: user_id,
          verify: UserVerifyStatus.Unverified
        })
      )
    } catch (error) {
      throw error
    }
  }

  async signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify?: number }) {
    try {
      return await Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
    } catch (error) {
      throw error
    }
  }

  async signVerifyEmailToken({ user_id }: { user_id: string }) {
    try {
      return await signToken({
        payload: {
          user_id: user_id
        },
        privateKey: process.env.SECRECT_KEY_VERIFYEMAIL as string,
        options: {
          expiresIn: process.env.EMAILVERIFY_EXPIRE as string
        }
      })
    } catch (error) {
      throw error
    }
  }

  async signVerifyForgotPasswordToken({ user_id }: { user_id: string }) {
    try {
      return await signToken({
        payload: {
          user_id
        },
        privateKey: process.env.SECRECT_KEY_FORGOTPASSWORD as string,
        options: {
          expiresIn: process.env.FORGOTPASSWORD_EXPIRE
        }
      })
    } catch (error) {
      throw error
    }
  }

  async decodeRefreshToken(refresh_token: string) {
    try {
      return await verifyToken({
        token: refresh_token,
        secretOrPublicKey: process.env.SECRECT_KEY_REFRESHTOKEN as string
      })
    } catch (error) {
      throw error
    }
  }

  async login({ user_id }: { user_id: string }) {
    try {
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
    } catch (error) {
      throw error
    }
  }

  async checkEmailExist(email: string) {
    try {
      return await databaseService.users.findOne({ email })
    } catch (error) {
      throw error
    }
  }

  async logout(refreshToken: string) {
    try {
      return await databaseService.refreshTokens.deleteOne({ token: refreshToken })
    } catch (error) {
      throw error
    }
  }

  async verifyEmailService(user_id: ObjectId) {
    try {
      await databaseService.users.updateOne(
        { _id: user_id },
        {
          $set: { verify: UserVerifyStatus.Verified },
          $currentDate: { updated_at: true }
        }
      )
    } catch (error) {
      throw error
    }
  }

  async sendAgainVerifyEmailService(user: User) {
    try {
      const newTokenVerifyEmail = await usersService.signVerifyEmailToken({
        user_id: String(String(user._id))
      })

      const domainNameForVerify = process.env.DOMAIN_NAME + '/users/verify-email?token=' + newTokenVerifyEmail

      // const msg = {
      //   to: user.email,
      //   from: process.env.COMPANY_MAIL as string,
      //   subject:`Verify Registeration Acoount`,
      //   text: `Please click here to verify: ${newTokenVerifyEmail}`,
      //   html: `<b>Please click here to verify:</b>
      //   <a href="${domainNameForVerify}" style="color: #007bff; text-decoration: underline;">${domainNameForVerify}</a> `,
      // }
      //
      // await sendMail(msg);
    } catch (error) {
      throw error
    }
  }

  async forgotPasswordService(user: User) {
    try {
      const id = user._id
      const forgotPasswordToken = await this.signVerifyForgotPasswordToken({ user_id: String(id) })

      const domainNameForVerify = process.env.DOMAIN_NAME + '/users/reset-password?token=' + forgotPasswordToken

      const msg = {
        to: user.email,
        from: process.env.COMPANY_MAIL as string,
        subject: `Verify Forgot Password`,
        text: `Please click here to verify: ${forgotPasswordToken}`,
        html: `<b>Please click here to verify:</b>
        <a href="${domainNameForVerify}" style="color: #007bff; text-decoration: underline;">${domainNameForVerify}</a> `
      }

      await sendMail(msg)
    } catch (error) {
      throw error
    }
  }

  async getDetailUser(id: ObjectId) {
    try {
      return await databaseService.users.findOne(
        { _id: id },
        {
          projection: {
            password: 0
          }
        }
      )
    } catch (error) {
      throw error
    }
  }

  async updateProfileService(_id: ObjectId, data: UpdateProfileRequest) {
    try {
      return await databaseService.users.findOneAndUpdate(
        { _id: _id },
        {
          $set: data
        },
        {
          returnDocument: 'after'
        }
      )
    } catch (error) {
      throw error
    }
  }

  async passwordService(_id: ObjectId, password: string) {
    try {
      return await databaseService.users.updateOne(
        { _id: _id },
        {
          $set: { password: await hashBcrypt(password) },
          $currentDate: { updated_at: true }
        }
      )
    } catch (error) {
      throw error
    }
  }
}

const usersService = new UsersService()
export default usersService
