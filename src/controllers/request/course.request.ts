import { ObjectId } from 'mongodb'

export interface GetCourseRequest {
  slug:string
}

export interface CourseRequest{
  _id?:ObjectId,
  title?:string,
  description?:string,
  teacherId?:Array<string>,
  lessonId:Array<string>,
  rating?:number,
  slug?:string
}

