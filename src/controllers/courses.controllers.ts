import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { Course, ICourse } from '~/models/schemas/course.schema'
import { ObjectId } from 'mongodb'
import courseServices from '~/services/courses.services'
import HTTP_STATUS from '~/constants/httpstatus'
import { CourseRequest, GetCourseRequest } from '~/controllers/request/course.request'

export const addCourseController = async (req: Request<ParamsDictionary, any, ICourse>, res: Response) => {
  const _id = new ObjectId()
  const title = req.body.title
  const description = req.body.description
  const teacherId = req.body.teacherId
  const lessonId = req.body.lessonId
  const rating = req.body.rating
  const slug = req.slugOfCourse
  const enrollmentId = req.body.enrollmentId

  const objectCourse = new Course({
    _id,
    title,
    description,
    teacherId,
    lessonId,
    rating,
    slug,
    enrollmentId
  })

  const result = await courseServices.createCourse(objectCourse)

  res.json({
    message: 'Create course Successfully',
    status: HTTP_STATUS.OK,
    data: {
      ...result
    }
  })
}

export const getCourseController = async (req: Request<ParamsDictionary, any, GetCourseRequest>, res: Response) => {
  const slug = req.params.slug
  const result = await courseServices.getCourse(slug)

  if (result) {
    res.json({
      message: 'Get Course Successfully',
      status: HTTP_STATUS.OK,
      data: {
        course: result
      }
    })
  } else {
    res.status(HTTP_STATUS.NO_CONTENT).json({
      message: 'Not found Course',
      status: HTTP_STATUS.NOT_FOUND,
      data: null
    })
  }
}

export const updateCourseController = async (req: Request<ParamsDictionary, any, CourseRequest>, res: Response) => {
  const newCourse = req.course
  const _id = new ObjectId(newCourse._id)
  delete newCourse._id
  const result = await courseServices.updateCourse(_id, newCourse)
  res.json({
    message: 'Update Course Successfully',
    status: HTTP_STATUS.OK,
    data: {
      course: result
    }
  })
}

export const deleteCourseController = async (req: Request<ParamsDictionary, any, CourseRequest>, res: Response) => {
  const _id = new ObjectId(req.course._id)
  const result = await courseServices.deleteCourse(_id)

  res.json({
    message: 'Delete Course Successfully',
    status: HTTP_STATUS.OK,
    data: result
  })
}

export const getCourseForStudentController = async (req: Request, res: Response) => {
  const { enrollmentId } = req.params
  console.log(enrollmentId)
  const courses = await courseServices.getCourseForStudentService(enrollmentId as string)

  res.json({
    message: 'Get Course for student',
    status: HTTP_STATUS.OK,
    courses
  })
}

export const getCourseForAdminController = async (req: Request, res: Response) => {
  const data = await courseServices.getCourseForAdminService()

  res.json({
    message: 'Get table course',
    status: HTTP_STATUS.OK,
    data
  })
}

export const deleteTeacherInCoureseController = async (req: Request, res: Response) => {
  const { courseId, teacherId } = req.body
  const id = new ObjectId(courseId)

  const data = await courseServices.deleteTecherInCourse(id, String(teacherId))

  res.json({
    message: 'delete teacher in courses successfully',
    status: HTTP_STATUS.OK,
    data
  })
}

export const deleteEnrollmentInCoureseController = async (req: Request, res: Response) => {
  const { courseId, enrollmentId } = req.body
  const id = new ObjectId(courseId)

  const data = await courseServices.deleteEnrollmentInCourse(id, String(enrollmentId))

  res.json({
    message: 'delete enrollment in courses successfully',
    status: HTTP_STATUS.OK,
    data
  })
}

export const addEnrollmentInCoureseController = async (req: Request, res: Response) => {
  const { courseId, enrollmentId } = req.body
  const id = new ObjectId(courseId)

  const data = await courseServices.addEnrollmentInCourse(id, String(enrollmentId))

  res.json({
    message: 'add enrollment in courses successfully',
    status: HTTP_STATUS.OK,
    data
  })
}

export const addTeacherInCoureseController = async (req: Request, res: Response) => {
  const { courseId, teacherId } = req.body
  const id = new ObjectId(courseId)

  const data = await courseServices.addTeacherInCourse(id, String(teacherId))

  res.json({
    message: 'add teacher in courses successfully',
    status: HTTP_STATUS.OK,
    data
  })
}

export const deleteSomeTeacherInCoureseController = async (req: Request, res: Response) => {
  const { courseId, teacherIds } = req.body
  const id = new ObjectId(courseId)

  const data = await courseServices.delteSomeTeacherInCourse(id, teacherIds)

  res.json({
    message: 'delete some teachers in courses successfully',
    status: HTTP_STATUS.OK,
    data
  })
}

export const deleteSomeEnrollmentsInCoureseController = async (req: Request, res: Response) => {
  const { courseId, enrollmentIds } = req.body
  const id = new ObjectId(courseId)

  const data = await courseServices.deleteSomeEnrollmentsInCourse(id, enrollmentIds)

  res.json({
    message: 'delete some enrollments in courses successfully',
    status: HTTP_STATUS.OK,
    data
  })
}

export const addSomeEnrollmentsInCoureseController = async (req: Request, res: Response) => {
  const { courseId, enrollmentIds } = req.body
  const id = new ObjectId(courseId)

  const data = await courseServices.addSomeEnrollmentsInCourse(id, enrollmentIds)

  res.json({
    message: 'add some enrollments in courses successfully',
    status: HTTP_STATUS.OK,
    data
  })
}

export const addSomeTeachersInCoureseController = async (req: Request, res: Response) => {
  const { courseId, teacherIds } = req.body
  const id = new ObjectId(courseId)

  const data = await courseServices.addSomeTeachersInCourse(id, teacherIds)

  res.json({
    message: 'add some teachers in courses successfully',
    status: HTTP_STATUS.OK,
    data
  })
}

export const paginationCourseController = async (req: Request, res: Response) => {
 
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.perPage as string) || 10; 


  const data = await courseServices.paginatioCourseService(page,limit)

  res.json({
    message: 'pagination course',
    status: HTTP_STATUS.OK,
    page: page,
    perPage: limit,
    totalItems: data.length,
    data
  })
}
