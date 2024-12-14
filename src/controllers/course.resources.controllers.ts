import { VerifiedCourseRequest } from './request/course.resource.request'
import { Response } from 'express'
import HTTP_STATUS from '~/constants/httpstatus'
import courseResourcesService from '~/services/course.resources.services'

export const getAllCourseResourceController = async (req: VerifiedCourseRequest, res: Response) => {
  try {
    const courseId = req.courseId
    const result = await courseResourcesService.getCourseResources(courseId)
    res.json({
      message: 'Get Course Resources Successfully',
      status: HTTP_STATUS.OK,
      data: {
        courseResources: result
      }
    })
  } catch (error: any) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: error.message,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
}
