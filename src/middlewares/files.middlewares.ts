import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import validate from '~/utils/validate'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpstatus'

export const downloadingFileValidation = validate(
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
      }
    },
    ['body']
  )
)
