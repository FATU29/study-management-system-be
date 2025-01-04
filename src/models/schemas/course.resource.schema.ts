import { ObjectId } from 'mongodb'
import { IFile, MAXIMUM_FILE_SIZE_ALLOWED } from './file.schema'

export interface IDocumentResourceInfo {
  file: IFile
}

export class DocumentResourceInfo {
  file: IFile

  constructor(documentResourceInfo: IDocumentResourceInfo) {
    this.file = documentResourceInfo.file
  }
}

export interface ILinkResourceInfo {
  url: string
}

export class LinkResourceInfo {
  url: string

  constructor(linkResourceInfo: ILinkResourceInfo) {
    this.url = linkResourceInfo.url
  }
}

export interface IAssignmentResourceInfo {
  description?: string
  attachments?: IFile[]
  openDate?: Date
  dueDate: Date
  maxFileSize?: number
  maxFileCount?: number
  // submissions: ISubmission[] // Store separately in a collection
}

export class AssignmentResourceInfo {
  description?: string
  attachments?: IFile[]
  openDate?: Date
  dueDate: Date
  maxFileSize?: number
  maxFileCount?: number
  // submissions: ISubmission[]

  constructor(assignmentResourceInfo: IAssignmentResourceInfo) {
    this.description = assignmentResourceInfo.description
    this.attachments = assignmentResourceInfo.attachments || []
    this.openDate = assignmentResourceInfo.openDate || new Date()
    this.dueDate = assignmentResourceInfo.dueDate
    // this.submissions = assignmentResourceInfo.submissions
    this.maxFileSize = assignmentResourceInfo.maxFileSize || MAXIMUM_FILE_SIZE_ALLOWED
    this.maxFileCount = assignmentResourceInfo.maxFileCount || 1
  }
}

export interface IAnnouncementResourceInfo {
  content: string
}

export class AnnouncementResourceInfo {
  content: string

  constructor(announcementResourceInfo: IAnnouncementResourceInfo) {
    this.content = announcementResourceInfo.content
  }
}

export type ResourceType = 'document' | 'link' | 'assignment' | 'announcement'
export type ResourceInfo =
  | IDocumentResourceInfo
  | ILinkResourceInfo
  | IAssignmentResourceInfo
  | IAnnouncementResourceInfo

export interface ICourseResource {
  _id?: ObjectId
  title: string
  courseId: ObjectId
  resourceType: ResourceType
  resourceInfo: ResourceInfo
  sectionLabel?: string
  createdAt?: Date
  updatedAt?: Date
}

export class CourseResource {
  _id?: ObjectId
  title: string
  courseId: ObjectId
  resourceType: ResourceType
  resourceInfo: ResourceInfo
  sectionLabel?: string
  createdAt?: Date
  updatedAt?: Date

  constructor(courseResource: ICourseResource) {
    this._id = courseResource._id
    this.title = courseResource.title
    this.courseId = courseResource.courseId
    this.resourceType = courseResource.resourceType
    this.resourceInfo = courseResource.resourceInfo
    this.sectionLabel = courseResource.sectionLabel
    this.createdAt = courseResource.createdAt
    this.updatedAt = courseResource.updatedAt
  }
}
