import { ObjectId } from 'mongodb'

export interface IFile {
  _id?: ObjectId
  filename: string
  mimetype: string // MIME type
  size: number
  uploadDate: Date
}

export const MAXIMUM_FILE_SIZE_ALLOWED = 1024 * 1024 * 5 // 5MB
export const MAXIMUM_FILE_COUNT_ALLOWED = 5

export interface FileMetadata {
  uploaderId: ObjectId
  sourceId?: ObjectId
  mimetype: string
}
