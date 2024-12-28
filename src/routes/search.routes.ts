import express from 'express'
import { searchAllUserController, searchCoursesController, searchTeacherNotJoinCourseController, searchTeachersInCourseController, searchUsersInCourseController, searchUsersNotJoinCourseController } from '~/controllers/search.controllers';
import { forAdminValidation } from '~/middlewares/courses.middlewares';
import { accessTokenValidation } from '~/middlewares/users.middlewares';
import { wrapRequestHandler } from '~/utils/handler';



const searchRouter = express.Router();


searchRouter.get('/all',accessTokenValidation,wrapRequestHandler(searchAllUserController))
searchRouter.post('/users',accessTokenValidation,forAdminValidation,wrapRequestHandler(searchUsersNotJoinCourseController));
searchRouter.post('/teachers',accessTokenValidation,forAdminValidation,wrapRequestHandler(searchTeacherNotJoinCourseController))
searchRouter.post('/courses',accessTokenValidation,forAdminValidation,wrapRequestHandler(searchCoursesController))
searchRouter.post('/teachersInCourse',accessTokenValidation,forAdminValidation,wrapRequestHandler(searchTeachersInCourseController));
searchRouter.post('/usersInCourse',accessTokenValidation,forAdminValidation,wrapRequestHandler(searchUsersInCourseController));


export default searchRouter;