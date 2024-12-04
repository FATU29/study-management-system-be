import express from 'express'
import { accessTokenValidation } from '~/middlewares/users.middlewares'
import {
  addCourseValidation,
  updateCourseValidation,
  deleteCourseValidation,
  getCourseValidation
} from '~/middlewares/courses.middlewares'
import {
  addCourseController,
  getCourseController,
  updateCourseController,
  deleteCourseController
} from '~/controllers/courses.controllers'
import { wrapRequestHandler } from '~/utils/handler'

const coursesRouter = express.Router()

coursesRouter.post('/add', accessTokenValidation, addCourseValidation, wrapRequestHandler(addCourseController))
coursesRouter.get('/:slug', accessTokenValidation, getCourseValidation, wrapRequestHandler(getCourseController))
coursesRouter.patch(
  '/update',
  accessTokenValidation,
  updateCourseValidation,
  wrapRequestHandler(updateCourseController)
)
coursesRouter.delete('/:id', accessTokenValidation, deleteCourseValidation, wrapRequestHandler(deleteCourseController))

export default coursesRouter
