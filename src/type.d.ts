
import * as express from 'express';
import { TokenPayload } from './controllers/request/user.request';
import { ICourse } from '~/models/schemas/course.schema'
import { CourseRequest } from '~/controllers/request/course.request'
import User from '~/models/schemas/user.schema'

declare global {
  namespace Express {
    interface Request {
      user: User,
      course: CourseRequest,
      slugOfCourse:string,
      decoded_authorization: TokenPayload,
      decoded_refreshToken: TokenPayload,
      decoded_verify_email_token: TokenPayload,
      decoded_verify_forgot_password_token: TokenPayload,
    }
  }
}