import { ObjectId } from 'mongodb'


export interface ICourse {
  _id?:ObjectId,
  title:string,
  description?:string,
  teacherIds: Array<string>,
  enrollmentIds:Array<string>,
  rating?:number,
  slug?:string
}


export class Course {
  _id?:ObjectId
  title:string
  description?:string
  teacherIds:Array<string>
  enrollmentIds:Array<string>
  rating?:number
  slug?:string

  constructor(course:ICourse) {
    this._id = course._id
    this.title = course.title
    this.description = course.description
    this.teacherIds = course.teacherIds
    this.rating = course.rating
    this.slug = course.slug
    this.enrollmentIds = course.enrollmentIds
  }
}


