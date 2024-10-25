import { checkSchema, ParamSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { compareBcrypt } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import validate from '~/utils/validate'

const passwordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
  }
}

const confirmPasswordSchema: ParamSchema = {
  notEmpty: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
  },
  isString: {
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
  },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
  },
  isStrongPassword: {
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
      }
      return true
    }
  }
}

export const loginValidation = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({ email: value })
            if (user === null) {
              throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
            }

            const isMatch = await compareBcrypt(req.body.password, user.password)
            if (!isMatch) {
              throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
            }
            
            const user_id = user._id as ObjectId;
            const refresh = await databaseService.refreshTokens.findOne({user_id:user_id})
            if(refresh !== null){
              await databaseService.refreshTokens.deleteOne({user_id:user_id});
            }

            req.user = user
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
      }
    },
    ['body']
  )
)

export const registerValidation = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isExistEmail = await usersService.checkEmailExist(value)
            if (isExistEmail) {
              throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      password: passwordSchema,
      confirmPassword: confirmPasswordSchema
    },
    ['body']
  )
)

export const acccessTokenValidation = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value, { req }) => {
            if (value === '') {
              throw new Error(USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED)
            }
            const access = value.split(' ')
            if (access[0] !== 'Bearer') {
              throw new Error(USERS_MESSAGES.LOGOUT_INVALID)
            } else if (access[0] === 'Bearer') {
              const accessToken = access[1]
              try {
                const decoded = await verifyToken({
                  token: accessToken,
                  secretOrPublicKey: process.env.SECRECT_KEY_ACCESSTOKEN as string
                })

                req.decoded_authorization = decoded
                return true
              } catch (error: any) {
                throw new Error(error.message)
              }
            }
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidation = validate(
  checkSchema({
    refreshToken: {
      custom: {
        options: async (value, { req }) => {
          if (value === '') {
            throw new Error(USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED)
          }
          try {
            const [decoded, refresh] = await Promise.all([
              await verifyToken({
                token: value,
                secretOrPublicKey: process.env.SECRECT_KEY_REFRESHTOKEN as string
              }),
              await databaseService.refreshTokens.findOne({ token: value })
            ])

            if(refresh === null){
              throw new Error(USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID);
            }

            req.decoded_refresh_token = decoded
            return true
          } catch (error: any) {
            if(error instanceof  ErrorWithStatus){
              throw new Error(USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST)
            } else {
              throw error;
            }


          }
        }
      }
    }
  })
)
