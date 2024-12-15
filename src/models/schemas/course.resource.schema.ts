import { ObjectId } from 'mongodb'

export interface IDocumentResourceInfo {
  fileId: ObjectId
}

export class DocumentResourceInfo {
  fileId: ObjectId

  constructor(documentResourceInfo: IDocumentResourceInfo) {
    this.fileId = documentResourceInfo.fileId
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
  attachmentIds?: ObjectId[]
  openDate?: Date
  dueDate: Date
  // submissions: ISubmission[] // Store separately in a collection
}

export class AssignmentResourceInfo {
  description?: string
  attachmentIds?: ObjectId[]
  openDate?: Date
  dueDate: Date
  // submissions: ISubmission[]

  constructor(assignmentResourceInfo: IAssignmentResourceInfo) {
    this.description = assignmentResourceInfo.description
    this.attachmentIds = assignmentResourceInfo.attachmentIds || []
    this.openDate = assignmentResourceInfo.openDate || new Date()
    this.dueDate = assignmentResourceInfo.dueDate
    // this.submissions = assignmentResourceInfo.submissions
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
