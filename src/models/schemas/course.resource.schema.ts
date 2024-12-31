import { ObjectId } from 'mongodb'
import { IFile } from './file.schema'

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
  // submissions: ISubmission[] // Store separately in a collection
}

export class AssignmentResourceInfo {
  description?: string
  attachments?: IFile[]
  openDate?: Date
  dueDate: Date
  // submissions: ISubmission[]

  constructor(assignmentResourceInfo: IAssignmentResourceInfo) {
    this.description = assignmentResourceInfo.description
    this.attachments = assignmentResourceInfo.attachments || []
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
  videos?: IVideo[];
  documents?: IDocument[];
  exercises?: IExercise[];
  sectionLabel?: string
  order: number
  createdAt?: Date
  updatedAt?: Date
}

export interface IVideo{
  title: string;
  url: string;
}

export interface IDocument {
  title: string;
  file: IFile;
}

export interface IExercise {
  title: string;
  file: IFile;
}

export class CourseResource {
  _id?: ObjectId
  title: string
  courseId: ObjectId
  videos?: IVideo[];
  documents?: IDocument[];
  exercises?: IExercise[];
  order: number
  sectionLabel?: string
  createdAt?: Date
  updatedAt?: Date

  constructor(courseResource: ICourseResource) {
    this._id = courseResource._id
    this.title = courseResource.title
    this.courseId = courseResource.courseId
    this.videos = courseResource.videos;
    this.documents = courseResource.documents;
    this.exercises = courseResource.exercises;
    this.sectionLabel = courseResource.sectionLabel
    this.order = courseResource.order
    this.createdAt = courseResource.createdAt
    this.updatedAt = courseResource.updatedAt
  }
}
