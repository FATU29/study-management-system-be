import { ParamsDictionary } from 'express-serve-static-core'
import {
  AddCourseResourceRequestBody,
  GetSubmissionsRequestQuery,
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
import fileService from '~/services/file.services'
import { ObjectId } from 'mongodb'
import { FileMetadata, IFile } from '~/models/schemas/file.schema'
import { at } from 'lodash'

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

export const getSubmissionsController = async (
  req: VerifiedCourseRecourseRequest<ParamsDictionary, any, any, GetSubmissionsRequestQuery>,
  res: Response
) => {
  try {
    const resourceId = req.previousResource._id!!
    const uploaderId = req.query.uploaderId
    if (uploaderId) {
      const result = await courseResourcesService.getSubmissions(resourceId.toHexString(), uploaderId)
      res.json({
        message: 'Get Submissions Successfully',
        status: HTTP_STATUS.OK,
        data: result
      })
    } else {
      const studentIds = req.currentCourse.enrollmentIds
      const submissions: IFile[] = []
      studentIds.forEach((id) => async () => {
        const result = await courseResourcesService.getSubmissions(resourceId.toHexString(), id)
        submissions.push(...result)
      })
      res.json({
        message: 'Get Submissions Successfully',
        status: HTTP_STATUS.OK,
        data: submissions
      })
    }
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
      courseId: new ObjectId(courseId),
      resourceType: resourceType,
      resourceInfo: stardardizeResourceInfo(resourceType, resourceInfo),
      sectionLabel: sectionLabel
    })
    const result = await courseResourcesService.addCourceResources(resource)

    const metadata: Partial<FileMetadata> = {
      sourceId: result.insertedId.toHexString() ?? undefined
    }
    if (resourceType === 'document') {
      // Update the sourceId metadata of the document file
      const documentFile = (resource.resourceInfo as IDocumentResourceInfo).file
      documentFile._id && (await fileService.updateFileMetadata(new ObjectId(documentFile._id).toHexString(), metadata))
    } else if (resourceType === 'assignment') {
      // Update the sourceId metadata of the assignment attachments files
      const attachments = (resource.resourceInfo as IAssignmentResourceInfo).attachments ?? []
      for (const attachment of attachments) {
        attachment._id && (await fileService.updateFileMetadata(new ObjectId(attachment._id).toHexString(), metadata))
      }
    }

    res.json({
      message: 'Add Course Resource Successfully',
      status: HTTP_STATUS.OK,
      data: result
    })
  } catch (error: any) {
    console.log(error.message)
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

    var metadata: Partial<FileMetadata> = {
      sourceId: resource._id?.toHexString() ?? undefined
    }
    if (previousResource.resourceType === 'document') {
      var oldFile = (previousResource.resourceInfo as IDocumentResourceInfo).file
      var newFile = (resource.resourceInfo as IDocumentResourceInfo).file

      if (newFile._id) {
        // Update the sourceId metadata of the new document file
        await fileService.updateFileMetadata(new ObjectId(newFile._id).toHexString(), metadata)
      }

      if (oldFile._id && newFile._id && oldFile._id !== newFile._id) {
        // Delete the old document file from the storage
        try {
          await fileService.deleteFile(new ObjectId(oldFile._id).toHexString(), 'bypass', true)
        } catch (error) {
          console.error('Error deleting the document file:', error)
        }
      }
    } else if (previousResource.resourceType === 'assignment') {
      var oldFiles = (previousResource.resourceInfo as IAssignmentResourceInfo).attachments ?? []
      var newFiles = (resource.resourceInfo as IAssignmentResourceInfo).attachments ?? []

      for (const newFile of newFiles) {
        if (newFile._id) {
          // Update the sourceId metadata of the new assignment attachment file
          await fileService.updateFileMetadata(new ObjectId(newFile._id).toHexString(), metadata)
        }
      }

      for (const oldFile of oldFiles) {
        if (oldFile._id && !newFiles.some((newFile) => newFile._id === oldFile._id)) {
          // Delete the old assignment attachment file from the storage
          try {
            await fileService.deleteFile(new ObjectId(oldFile._id).toHexString(), 'bypass', true)
          } catch (error) {
            console.error('Error deleting the assignment attachment file:', error)
          }
        }
      }
    }

    const result = await courseResourcesService.updateCourseResource(resource)
    res.json({
      message: 'Update Course Resource Successfully',
      status: HTTP_STATUS.OK,
      data: result
    })
  } catch (error: any) {
    console.log(error.message)
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: error.message,
      status: HTTP_STATUS.BAD_REQUEST
    })
  }
}

export const deleteCourseResourceController = async (req: VerifiedCourseRecourseRequest, res: Response) => {
  try {
    const resourceId = req.params._id
    const previousResource = req.previousResource

    if (previousResource.resourceType === 'document') {
      // Delete the document file from the storage
      const documentFile = (previousResource.resourceInfo as IDocumentResourceInfo).file
      try {
        documentFile._id && (await fileService.deleteFile(new ObjectId(documentFile._id).toHexString(), 'bypass', true))
      } catch (error) {
        console.error('Error deleting the document file:', error)
      }
    } else if (previousResource.resourceType === 'assignment') {
      // Delete the assignment attachments files from the storage
      const attachments = (previousResource.resourceInfo as IAssignmentResourceInfo).attachments ?? []
      for (const attachment of attachments) {
        try {
          attachment._id && (await fileService.deleteFile(new ObjectId(attachment._id).toHexString(), 'bypass', true))
        } catch (error) {
          console.error('Error deleting the assignment attachment file:', error)
        }
      }
    }

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
