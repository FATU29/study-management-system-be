import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpstatus'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import validate from '~/utils/validate'

export const existingCourseValidation = validate(
  checkSchema(
    {
      slug: {
        notEmpty: true,
        trim: true,
        custom: {
          options: async (value, { req }) => {
            try {
              const course = await databaseService.courses.findOne({ slug: value })
              if (!course) {
                throw new ErrorWithStatus({
                  message: `Course with slug '${value}' not exist`,
                  status: HTTP_STATUS.UNPROCESSABLE_ENTITY
                })
              }

              req.courseId = course._id.toHexString()
              // throw new ErrorWithStatus({
              //   message: `Course params '${JSON.stringify(req.params)}'`,
              //   status: HTTP_STATUS.OK
              // })
            } catch (error: any) {
              throw error
            }
          }
        }
      }
    },
    ['params']
  )
)
