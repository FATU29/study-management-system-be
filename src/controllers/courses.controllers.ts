import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { Course, ICourse } from '~/models/schemas/course.schema'
import { ObjectId } from 'mongodb'
import courseServices from '~/services/courses.services'
import HTTP_STATUS from '~/constants/httpstatus'
import { CourseRequest, GetCourseRequest } from '~/controllers/request/course.request'



export const addCourseController = async (
  req: Request<ParamsDictionary, any, ICourse>,
  res: Response
) => {
  const _id = new ObjectId();
  const title = req.body.title;
  const description = req.body.description;
  const teacherId = req.body.teacherId;
  const lessonId = req.body.lessonId;
  const rating = req.body.rating;
  const slug = req.slugOfCourse;
  const enrollmentId = req.body.enrollmentId;

  const objectCourse = new Course({
    _id,
    title,
    description,
    teacherId,
    lessonId,
    rating,
    slug,
    enrollmentId
  })

  const result = await courseServices.createCourse(objectCourse);

  res.json({
    message:"Create course Successfully",
    status:HTTP_STATUS.OK,
    data:{
      ...result
    }
  })
}


export const getCourseController = async (
  req: Request<ParamsDictionary, any, GetCourseRequest>,
  res: Response
) => {
  const slug = req.params.slug;
  const result = await courseServices.getCourse(slug);

  if(result){
    res.json({
      message:"Get Course Successfully",
      status:HTTP_STATUS.OK,
      data:{
        course: result
      }
    })
  } else {
    res.status(HTTP_STATUS.NO_CONTENT).json({
      message:"Not found Course",
      status:HTTP_STATUS.NOT_FOUND,
      data:null
    })
  }
}


export const updateCourseController = async (
  req: Request<ParamsDictionary, any, CourseRequest>,
  res: Response
) => {

    const newCourse = req.course;
    const _id = new ObjectId(newCourse._id)
    delete newCourse._id
    const result = await courseServices.updateCourse(_id,newCourse);
    res.json({
      message:"Update Course Successfully",
      status:HTTP_STATUS.OK,
      data:{
        course:result
      }
    })
}


export const deleteCourseController = async (
  req: Request<ParamsDictionary, any, CourseRequest>,
  res: Response
) => {
  const _id = new ObjectId(req.course._id);
  const result = await courseServices.deleteCourse(_id);

  res.json({
    message:"Delete Course Successfully",
    status:HTTP_STATUS.OK,
    data:result
  })
}