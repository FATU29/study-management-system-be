import { ParamsDictionary } from 'express-serve-static-core'
import {
  AddCourseResourceRequestBody,
  UpdateCourseResourceRequestBody,
  VerifiedCourseRecourseRequest,
  VerifiedCourseRequest
} from './request/course.resource.request'
import { Response } from 'express'
import HTTP_STATUS from '~/constants/httpstatus'
import courseResourcesService from '~/services/course.resources.services'
import {
  AnnouncementResourceInfo,
  AssignmentResourceInfo,
  CourseResource,
  DocumentResourceInfo,
  IAnnouncementResourceInfo,
  IAssignmentResourceInfo,
  IDocumentResourceInfo,
  ILinkResourceInfo,
  LinkResourceInfo,
  ResourceInfo,
  ResourceType
} from '~/models/schemas/course.resource.schema'

export const getAllCourseResourceController = async (req: VerifiedCourseRequest, res: Response) => {
  try {
    const courseId = req.currentCourse._id!!
    const result = await courseResourcesService.getCourseResources(courseId)
    res.json({
      message: 'Get Course Resources Successfully',
      status: HTTP_STATUS.OK,
      data: result
    })
  } catch (error: any) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: error.message,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
}

const stardardizeResourceInfo = (resourceType: ResourceType, resourceInfo: ResourceInfo): ResourceInfo => {
  switch (resourceType) {
    case 'document':
      return new DocumentResourceInfo(resourceInfo as IDocumentResourceInfo)
    case 'link':
      return new LinkResourceInfo(resourceInfo as ILinkResourceInfo)
    case 'assignment':
      return new AssignmentResourceInfo(resourceInfo as IAssignmentResourceInfo)
    case 'announcement':
      return new AnnouncementResourceInfo(resourceInfo as IAnnouncementResourceInfo)
  }
}

export const addCourseResourceController = async (
  req: VerifiedCourseRequest<ParamsDictionary, any, AddCourseResourceRequestBody>,
  res: Response
) => {
  try {
    const courseId = req.currentCourse._id!!
    const { title, resourceType, resourceInfo, sectionLabel } = req.body
    const resource = new CourseResource({
      title: title,
      courseId: courseId,
      resourceType: resourceType,
      resourceInfo: stardardizeResourceInfo(resourceType, resourceInfo),
      sectionLabel: sectionLabel
    })
    const result = await courseResourcesService.addCourceResources(resource)
    res.json({
      message: 'Add Course Resource Successfully',
      status: HTTP_STATUS.OK,
      data: result
    })
  } catch (error: any) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: error.message,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
}

export const updateCourseResourceController = async (
  req: VerifiedCourseRecourseRequest<ParamsDictionary, any, UpdateCourseResourceRequestBody>,
  res: Response
) => {
  try {
    const courseId = req.currentCourse._id!!
    const previousResource = req.previousResource
    const { title, resourceInfo, sectionLabel } = req.body
    const resource = {
      _id: previousResource._id,
      title: title,
      courseId: courseId,
      resourceType: previousResource.resourceType,
      resourceInfo: stardardizeResourceInfo(previousResource.resourceType, resourceInfo),
      sectionLabel: sectionLabel
    }
    const result = await courseResourcesService.updateCourseResource(resource)
    res.json({
      message: 'Update Course Resource Successfully',
      status: HTTP_STATUS.OK,
      data: result
    })
  } catch (error: any) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: error.message,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
}

export const deleteCourseResourceController = async (req: VerifiedCourseRecourseRequest, res: Response) => {
  try {
    const resourceId = req.params._id
    const result = await courseResourcesService.deleteCourseResource(resourceId)
    res.json({
      message: 'Delete Course Resource Successfully',
      status: HTTP_STATUS.OK,
      data: result
    })
  } catch (error: any) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: error.message,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
}
