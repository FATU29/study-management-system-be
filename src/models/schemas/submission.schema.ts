import { ObjectId } from 'mongodb'
import { IFile } from './file.schema'

export interface ISubmission {
  _id?: ObjectId
  studentId: ObjectId
  assignmentId: ObjectId
  submittedFiles: IFile[]
  lastModifiedDate: Date
  grade?: number
}

export class Submission {
  _id?: ObjectId
  studentId: ObjectId
  assignmentId: ObjectId
  submittedFiles: IFile[]
  lastModifiedDate: Date
  grade?: number

  constructor(submission: ISubmission) {
    this._id = submission._id
    this.studentId = submission.studentId
    this.assignmentId = submission.assignmentId
    this.submittedFiles = submission.submittedFiles
    this.lastModifiedDate = submission.lastModifiedDate
    this.grade = submission.grade
  }
}
