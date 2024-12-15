import validate from '~/utils/validate'
import { checkSchema } from 'express-validator'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpstatus'
import { createSlug } from '~/utils/slugify'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { NextFunction, Response } from 'express'

export const addCourseValidation = validate(
  checkSchema(
    {
      title: {
        custom: {
          options: async (value, { req }) => {
            const role = req.decoded_authorization.role
            if (role !== 'ADMIN') {
              throw new ErrorWithStatus({
                message: 'Just admin has permission',
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY
              })
            }

            const title = value.trim()

            if (value === '') {
              throw new ErrorWithStatus({
                message: 'Title not empty',
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY
              })
            }
            const slug = createSlug(title)

            try {
              const course = await databaseService.courses.findOne({ slug: slug })
              if (course) {
                throw new ErrorWithStatus({
                  message: 'Course has existed',
                  status: HTTP_STATUS.UNPROCESSABLE_ENTITY
                })
              }

              req.slugOfCourse = slug
              return true
            } catch (error: any) {
              throw error
            }
          }
        }
      }
    },
    ['body']
  )
)

export const updateCourseValidation = validate(
  checkSchema(
    {
      title: {
        custom: {
          options: async (value, { req }) => {
            const role = req.decoded_authorization.role
            if (role !== 'ADMIN') {
              throw new ErrorWithStatus({
                message: 'Just admin has permission',
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY
              })
            }

            if (value === '') {
              return true
            }

            const newTitle = value.trim()
            const newSlug = createSlug(newTitle)

            try {
              const course = await databaseService.courses.findOne({ slug: newSlug })
              if (course) {
                throw new ErrorWithStatus({
                  message: 'Slug has existed',
                  status: HTTP_STATUS.UNPROCESSABLE_ENTITY
                })
              }

              req.course = {
                ...req.body,
                slug: newSlug
              }
              return true
            } catch (error: any) {
              throw error
            }
          }
        }
      }
    },
    ['body']
  )
)

export const courseValidation = validate(
  checkSchema(
    {
      courseId: {
        notEmpty: true,
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const role = req.decoded_authorization.role
            if (role !== 'ADMIN') {
              throw new ErrorWithStatus({
                message: 'Just admin has permission',
                status: HTTP_STATUS.FORBIDDEN
              })
            }

            
            
            try {
              const course = await databaseService.courses.findOne({ _id: new ObjectId(value) })
              if (!course) {
                throw new ErrorWithStatus({
                  message: 'Course not exist',
                  status: HTTP_STATUS.UNPROCESSABLE_ENTITY
                })
              }
              
              req.course = course
            } catch (error: any) {
              throw error
            }
          }
        }
      }
    },
    ['body']
  )
)

export const getCourseValidation = validate(
  checkSchema(
    {
      slug: {
        notEmpty: true,
        trim: true,
        custom: {
          options: async (value, { req }) => {}
        }
      }
    },
    ['params']
  )
)

export const forAdminValidation = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { role } = req.decoded_authorization
    if (role !== 'ADMIN') {
      throw new ErrorWithStatus({
        message: 'Just admin has permission',
        status: HTTP_STATUS.FORBIDDEN
      })
    }
    next()
  } catch (error) {
    next(error)
  }
}
