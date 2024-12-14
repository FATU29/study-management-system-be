import { Request } from 'express'

export interface VerifiedCourseRequest extends Request {
  courseId: string
}
