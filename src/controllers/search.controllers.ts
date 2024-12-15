import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpstatus'
import searchService from '~/services/search.services'

export const searchUsersNotJoinCourseController = async (req: Request, res: Response) => {
  let { courseId, content } = req.body
  content = content as string
  const id = courseId ? new ObjectId(courseId as string) : undefined
  if (!content) {
    content = ''
  }

  const data = await searchService.searchUsersNotJoinCourse({ courseId: id, content })

  res.status(HTTP_STATUS.OK).json({
    message: 'search UsersNotJoinCourseController successfully',
    code: HTTP_STATUS.OK,
    data: data
  })
}

export const searchTeacherNotJoinCourseController = async (req: Request, res: Response) => {
  let { content, courseId } = req.body
  content = content as string
  const id = courseId ? new ObjectId(courseId as string) : undefined
  if (!content) {
    content = ''
  }

  const data = await searchService.searchTeachersNotJoinCourse({ courseId: id, content })

  res.status(HTTP_STATUS.OK).json({
    message: 'search teacherNotJoinCourseController successfully',
    code: HTTP_STATUS.OK,
    data: data
  })
}

export const searchTeachersInCourseController = async (req: Request, res: Response) => {
  let { content, courseId } = req.body
  content = content as string
  const id = courseId ? new ObjectId(courseId as string) : undefined
  if (!content) {
    content = ''
  }

  const data = await searchService.searchTeachersJoinCourse({ courseId: id, content })

  res.status(HTTP_STATUS.OK).json({
    message: 'search searchTeachersInCourse successfully',
    code: HTTP_STATUS.OK,
    data: data
  })
}

export const searchUsersInCourseController = async (req: Request, res: Response) => {
  let { content, courseId } = req.body
  content = content as string
  const id = courseId ? new ObjectId(courseId as string) : undefined
  if (!content) {
    content = ''
  }

  const data = await searchService.searchUsersJoinCourse({ courseId: id, content })

  res.status(HTTP_STATUS.OK).json({
    message: 'search searchUsersInCourse successfully',
    code: HTTP_STATUS.OK,
    data: data
  })
}

export const searchCoursesController = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const perPage = parseInt(req.query.perPage as string) || 5
  const { content } = req.body

  const data = await searchService.searchCourse(content, page, perPage);


  res.status(HTTP_STATUS.OK).json({
    message: 'search searchCourse successfully',
    code: HTTP_STATUS.OK,
    page: page,
    perPage: perPage,
    totalItems: data.length,
    data:  data.rows
  })

}
