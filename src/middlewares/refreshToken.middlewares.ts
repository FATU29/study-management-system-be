import validate from '~/utils/validate'
import { checkSchema } from 'express-validator'

export const newAccessTokenValidation = validate(
  checkSchema(
    {
      refreshToken: {
        notEmpty: true
      }
    },
    ['body']
  )
)
