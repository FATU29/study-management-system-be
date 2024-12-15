import { ObjectId } from 'mongodb'

export interface ISubmission {
  _id?: ObjectId
  studentId: ObjectId
  assignmentId: ObjectId
  submittedFileIds: ObjectId[]
  lastModifiedDate: Date
  grade?: number
}

export class Submission {
  _id?: ObjectId
  studentId: ObjectId
  assignmentId: ObjectId
  submittedFileIds: ObjectId[]
  lastModifiedDate: Date
  grade?: number

  constructor(submission: ISubmission) {
    this._id = submission._id
    this.studentId = submission.studentId
    this.assignmentId = submission.assignmentId
    this.submittedFileIds = submission.submittedFileIds
    this.lastModifiedDate = submission.lastModifiedDate
    this.grade = submission.grade
  }
}
