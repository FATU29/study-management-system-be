import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpstatus'
import { VerifiedCourseRequest } from '~/controllers/request/course.resource.request'
import { ErrorWithStatus } from '~/models/Errors'
import { Course } from '~/models/schemas/course.schema'
import databaseService from '~/services/database.services'
import validate from '~/utils/validate'

export const existingCourseValidation = validate(
  checkSchema(
    {
      slug: {
        isString: true,
        trim: true,
        notEmpty: true,
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

              req.currentCourse = course
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

export const courseResourceValidation = validate(
  checkSchema(
    {
      title: {
        isString: true,
        trim: true,
        notEmpty: true
      },
      sectionLabel: {
        optional: true,
        isString: true,
        trim: true
      }
    },
    ['body']
  )
)

export const existingCourseResourceValidation = validate(
  checkSchema(
    {
      _id: {
        notEmpty: true,
        custom: {
          options: async (value, { req }) => {
            try {
              const course = req.currentCourse as Course
              const courseId = course._id
              if (!ObjectId.isValid(value)) {
                throw new ErrorWithStatus({
                  message: `Invalid resource id '${value}'`,
                  status: HTTP_STATUS.UNPROCESSABLE_ENTITY
                })
              }
              const resource = await databaseService.courseResources.findOne({
                _id: ObjectId.createFromHexString(value),
                courseId: courseId
              })
              if (!resource) {
                throw new ErrorWithStatus({
                  message: `Resource with id '${value}' not exist in course '${course.slug}'`,
                  status: HTTP_STATUS.UNPROCESSABLE_ENTITY
                })
              }

              req.previousResource = resource
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

// export const existingResourceTypeValidation = validate(
//   checkSchema(
//     {
//       resourceType: {
//         notEmpty: true,
//         trim: true,
//         custom: {
//           options: async (value, { req }) => {
//             try {
//               if (req.previousResource) {
//                 const previousResource = req.previousResource as ICourseResource
//                 if (previousResource.resourceType !== value) {
//                   throw new ErrorWithStatus({
//                     message: `Resource type '${value}' is not match with previous resource type '${previousResource.resourceType}'`,
//                     status: HTTP_STATUS.UNPROCESSABLE_ENTITY
//                   })
//                 }
//               } else {
//                 // This patch should not be reached if `existingCourseResourceValidation` is used before this
//               }
//             } catch (error) {
//               throw error
//             }
//           }
//         }
//       }
//     },
//     ['body']
//   )
// )

export const courseResourceAuthorizedEditorValidation = async (
  req: VerifiedCourseRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const editorRole = req.decoded_authorization.role
    if (editorRole === 'ADMIN') {
      next()
      return
    }

    const courseTeacherIds = req.currentCourse.teacherIds
    const editorId = req.decoded_authorization.user_id.toString()

    if (!courseTeacherIds.includes(editorId)) {
      res.status(HTTP_STATUS.FORBIDDEN).json({
        message: 'Only managing teachers or admins has permission to update or delete course resource',
        status: HTTP_STATUS.FORBIDDEN
      })
      return
    }
    next()
  } catch (error: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: `Something went wrong while checking resource edit permission: ${error.message}`,
      status: error.status
    })
  }
}
