import { checkSchema } from 'express-validator'
import validate from '~/utils/validate'

export const fileIdentityValidation = validate(
  checkSchema(
    {
      sourceId: {
        optional: true,
        trim: true,
        notEmpty: true,
        isString: true
      },
      fileId: {
        isString: true,
        trim: true,
        notEmpty: true

        // custom: {
        //   options: (value: string) => {
        //     if (!ObjectId.isValid(value)) {
        //       throw new ErrorWithStatus({
        //         status: HTTP_STATUS.BAD_REQUEST,
        //         message: 'Invalid file ID'
        //       })
        //     }
        //   }
        // }
      },
      mode: {
        in: ['params'],
        optional: true,
        trim: true,
        notEmpty: true,
        isString: true,
        isIn: {
          options: [['attachment', 'inline']]
        }
      }
    },
    ['body']
  )
)

export const fileQueryValidation = validate(
  checkSchema(
    {
      fileId: {
        isString: true,
        trim: true,
        notEmpty: true
      },
      sourceId: {
        optional: true,
        trim: true,
        notEmpty: true,
        isString: true
      },
      inline: {
        optional: true,
        trim: true,
        notEmpty: true,
        isBoolean: true
      }
    },
    ['query']
  )
)
