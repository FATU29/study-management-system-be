import { ObjectId } from 'mongodb'

export interface IFile {
  _id?: ObjectId
  filename: string
  contentType: string // MIME type
  uploaderId: ObjectId // Teacher's _id in CourseResource, or User's _id in UserStorage
  sourceId: ObjectId // Maybe from CourseResource(Resource's _id), or UserStorage (null)
  length: number
  data: Buffer
}

export class File {
  _id?: ObjectId
  filename: string
  contentType: string
  uploaderId: ObjectId
  sourceId: ObjectId
  length: number
  data: Buffer

  constructor(file: IFile) {
    this._id = file._id
    this.filename = file.filename
    this.contentType = file.contentType
    this.uploaderId = file.uploaderId
    this.sourceId = file.sourceId
    this.length = file.length
    this.data = file.data
  }
}
