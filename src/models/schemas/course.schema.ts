import { ObjectId } from 'mongodb'


export interface ICourse {
  _id?:ObjectId,
  title:string,
  description?:string,
  teacherId: Array<string>,
  lessonId:Array<string>,
  enrollmentId:Array<string>,
  rating?:number,
  slug?:string
}


export class Course {
  _id?:ObjectId
  title:string
  description?:string
  teacherId:Array<string>
  lessonId:Array<string>
  enrollmentId:Array<string>
  rating?:number
  slug?:string

  constructor(course:ICourse) {
    this._id = course._id
    this.title = course.title
    this.description = course.description
    this.teacherId = course.teacherId
    this.lessonId = course.lessonId
    this.rating = course.rating
    this.slug = course.slug
    this.enrollmentId = course.enrollmentId
  }
}


