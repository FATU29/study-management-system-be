import { Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ICourseResource, ResourceInfo, ResourceType } from '~/models/schemas/course.resource.schema'
import { ICourse } from '~/models/schemas/course.schema'

export interface VerifiedCourseRequest<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = any>
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  currentCourse: ICourse
}

export interface VerifiedCourseRecourseRequest<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = any>
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  currentCourse: ICourse
  previousResource: ICourseResource
}

export interface AddCourseResourceRequestBody {
  title: string
  resourceType: ResourceType
  resourceInfo: any // See ResourceInfo
  sectionLabel?: string
}

export interface UpdateCourseResourceRequestBody {
  title: string
  resourceInfo: any // See ResourceInfo
  sectionLabel?: string
}
