import express from 'express'
import {
  addCourseResourceController,
  deleteCourseResourceController,
  getAllCourseResourceController,
  getSubmissionsController,
  updateCourseResourceController
} from '~/controllers/course.resources.controllers'
import {
  courseResourceAuthorizedEditorValidation,
  courseResourceValidation,
  existingCourseResourceValidation
} from '~/middlewares/course.resources.middlewares'
import { simpleControlWrapper } from '~/utils/handler'

const resourceRouter = express.Router({ mergeParams: true })
// req.courseId should be added to the request object before reaching this controller
// (by "existingCourseValidation" middleware)

resourceRouter.get('/', simpleControlWrapper(getAllCourseResourceController))

resourceRouter.get(
  '/submissions/:_id',
  existingCourseResourceValidation,
  simpleControlWrapper(getSubmissionsController)
)

resourceRouter.post(
  '/add',
  // courseResourceAuthorizedEditorValidation as express.RequestHandler, // TODO: Uncomment this line
  courseResourceValidation,
  simpleControlWrapper(addCourseResourceController)
)

resourceRouter.patch(
  '/update/:_id',
  // courseResourceAuthorizedEditorValidation as express.RequestHandler, // TODO: Uncomment this line
  existingCourseResourceValidation,
  // existingResourceTypeValidation, // resourceType should not be updated
  courseResourceValidation,
  simpleControlWrapper(updateCourseResourceController)
)

resourceRouter.delete(
  '/delete/:_id',
  // courseResourceAuthorizedEditorValidation as express.RequestHandler, // TODO: Uncomment this line
  existingCourseResourceValidation,
  simpleControlWrapper(deleteCourseResourceController)
)

export default resourceRouter
