import { Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ICourseResource, ResourceInfo, ResourceType } from '~/models/schemas/course.resource.schema'

export interface VerifiedCourseRequest<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = any>
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  courseId: string
}

export interface VerifiedCourseRecourseRequest<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = any>
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  courseId: string
  previousResource: ICourseResource
}

export interface AddCourseResourceRequestBody {
  title: string
  resourceType: ResourceType
  resourceInfo: any
  sectionLabel?: string
}

export interface UpdateCourseResourceRequestBody {
  title: string
  resourceInfo: ResourceInfo
  sectionLabel?: string
}
