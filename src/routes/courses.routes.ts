import express from 'express'
import { accessTokenValidation } from '~/middlewares/users.middlewares'
import {
  addCourseValidation,
  updateCourseValidation,
  getCourseValidation,
  courseValidation,
  forAdminValidation,
} from '~/middlewares/courses.middlewares'
import {
  addCourseController,
  getCourseController,
  updateCourseController,
  deleteCourseController,
  getCourseForAdminController,
  addEnrollmentInCoureseController,
  deleteTeacherInCoureseController,
  deleteEnrollmentInCoureseController,
  addTeacherInCoureseController,
  deleteSomeTeacherInCoureseController,
  deleteSomeEnrollmentsInCoureseController,
  addSomeEnrollmentsInCoureseController,
  addSomeTeachersInCoureseController,
  paginationCourseController,
  getCourseForStudentController
} from '~/controllers/courses.controllers'
import { wrapRequestHandler } from '~/utils/handler'

const coursesRouter = express.Router()


coursesRouter.get('/',accessTokenValidation,forAdminValidation,wrapRequestHandler(paginationCourseController))
coursesRouter.post('/add', accessTokenValidation, addCourseValidation, wrapRequestHandler(addCourseController))
coursesRouter.get('/getCourseForStudent', accessTokenValidation, wrapRequestHandler(getCourseForStudentController))
coursesRouter.get('/getCourseForAdmin', accessTokenValidation,wrapRequestHandler(getCourseForAdminController))



coursesRouter.post('/addEnrollmentInCourse',accessTokenValidation,courseValidation,wrapRequestHandler(addEnrollmentInCoureseController));
coursesRouter.post('/addSomeEnrollmentsInCourse',accessTokenValidation,courseValidation,wrapRequestHandler(addSomeEnrollmentsInCoureseController));
coursesRouter.post('/addTeacherInCourse',accessTokenValidation,courseValidation,wrapRequestHandler(addTeacherInCoureseController));
coursesRouter.post('/addSomeTeachersInCourse',accessTokenValidation,courseValidation,wrapRequestHandler(addSomeTeachersInCoureseController));


coursesRouter.delete('/deleteTeacherInCourse',accessTokenValidation,courseValidation,wrapRequestHandler(deleteTeacherInCoureseController));
coursesRouter.delete('/deleteEnrollmentInCourse',accessTokenValidation,courseValidation,wrapRequestHandler(deleteEnrollmentInCoureseController));
coursesRouter.delete('/deleteSomeTeacherInCourse',accessTokenValidation,courseValidation,wrapRequestHandler(deleteSomeTeacherInCoureseController));
coursesRouter.delete('/deleteSomeEnrollmentsInCourse',accessTokenValidation,courseValidation,wrapRequestHandler(deleteSomeEnrollmentsInCoureseController));


coursesRouter.delete('/deleteCourse', accessTokenValidation, courseValidation, wrapRequestHandler(deleteCourseController))
coursesRouter.get('/:slug', accessTokenValidation, getCourseValidation, wrapRequestHandler(getCourseController))
coursesRouter.patch(
  '/update',
  accessTokenValidation,
  updateCourseValidation,
  wrapRequestHandler(updateCourseController)
)


export default coursesRouter
