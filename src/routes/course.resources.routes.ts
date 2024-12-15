import express from 'express'
import {
  addCourseResourceController,
  deleteCourseResourceController,
  getAllCourseResourceController,
  updateCourseResourceController
} from '~/controllers/course.resources.controllers'
import {
  courseResourceValidation,
  existingCourseResourceValidation,
  existingResourceTypeValidation
} from '~/middlewares/course.resources.middlewares'
import { simpleControlWrapper } from '~/utils/handler'

const resourceRouter = express.Router({ mergeParams: true })
// req.courseId should be added to the request object before reaching this controller
// (by "existingCourseValidation" middleware)

resourceRouter.get('/', simpleControlWrapper(getAllCourseResourceController))

resourceRouter.post('/add', courseResourceValidation, simpleControlWrapper(addCourseResourceController))

resourceRouter.patch(
  '/update/:_id',
  existingCourseResourceValidation,
  existingResourceTypeValidation,
  courseResourceValidation,
  simpleControlWrapper(updateCourseResourceController)
)

resourceRouter.delete(
  '/delete/:_id',
  existingCourseResourceValidation,
  simpleControlWrapper(deleteCourseResourceController)
)

export default resourceRouter
