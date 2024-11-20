import validate from '~/utils/validate'
import { checkSchema } from 'express-validator'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpstatus'
import databaseService from '~/services/database.services'

export const addRoleMiddlewares = validate(
  checkSchema(
    {
      name: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            // const role  = req.decoded_authorization.role;
            // if(role !== "TEACHER"){
            //   throw new ErrorWithStatus({
            //     message:"Just teacher has permission",
            //     status:HTTP_STATUS.UNPROCESSABLE_ENTITY
            //   })
            // }

            if (value === '') {
              throw new ErrorWithStatus({
                message: 'Role name not empty',
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY
              })
            }

            try {
              const role = await databaseService.role.findOne({ value })
              if (role) {
                throw new ErrorWithStatus({
                  message: 'Role has existed',
                  status: HTTP_STATUS.UNPROCESSABLE_ENTITY
                })
              }

              return true
            } catch (e: any) {
              throw e
            }
          }
        }
      }
    },
    ['body']
  )
)

export const getRoleMiddlewares = validate(
  checkSchema(
    {
      name: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            // const role  = req.decoded_authorization.role;
            // if(role !== "TEACHER"){
            //   throw new ErrorWithStatus({
            //     message:"Just teacher has permission",
            //     status:HTTP_STATUS.UNPROCESSABLE_ENTITY
            //   })
            // }

            if (value === '') {
              throw new ErrorWithStatus({
                message: '_id Role not empty',
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY
              })
            }
            return true
          }
        }
      }
    },
    ['params']
  )
)


export const deleteRoleMiddleWares = validate(checkSchema({
  name: {
    trim: true,
    custom: {
      options: async (value, { req }) => {
        // const role  = req.decoded_authorization.role;
        // if(role !== "TEACHER"){
        //   throw new ErrorWithStatus({
        //     message:"Just teacher has permission",
        //     status:HTTP_STATUS.UNPROCESSABLE_ENTITY
        //   })
        // }

        if (value === '') {
          throw new ErrorWithStatus({
            message: '_id Role not empty',
            status: HTTP_STATUS.UNPROCESSABLE_ENTITY
          })
        }
        return true
      }
    }
  }
}))


export const updateRoleMiddlewares = validate(
  checkSchema(
    {
      name: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            // const role  = req.decoded_authorization.role;
            // if(role !== "TEACHER"){
            //   throw new ErrorWithStatus({
            //     message:"Just teacher has permission",
            //     status:HTTP_STATUS.UNPROCESSABLE_ENTITY
            //   })
            // }

            if (value === '') {
              throw new ErrorWithStatus({
                message: 'Role name not empty',
                status: HTTP_STATUS.UNPROCESSABLE_ENTITY
              })
            }

            try {
              const role = await databaseService.role.findOne({ value })
              if (!role) {
                throw new ErrorWithStatus({
                  message: 'Role not existed',
                  status: HTTP_STATUS.UNPROCESSABLE_ENTITY
                })
              }

              return true
            } catch (e: any) {
              throw e
            }
          }
        }
      }
    },
    ['body']
  )
)
