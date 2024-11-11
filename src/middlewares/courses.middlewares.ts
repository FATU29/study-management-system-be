import validate from '~/utils/validate'
import { checkSchema } from 'express-validator'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpstatus'
import { createSlug } from '~/utils/slugify'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'


export const addCourseValidation = validate(checkSchema({
   title: {
     custom: {
       options: async (value,{req}) => {
         const title = value.trim();

          if(value === ""){
            throw new ErrorWithStatus({
              message:"Title not empty",
              status: HTTP_STATUS.UNPROCESSABLE_ENTITY
            })
          }
          const slug = createSlug(title);

          try {
            const course = await databaseService.courses.findOne({slug: slug});
            if(course){
               throw new ErrorWithStatus({
                message:"Course has existed",
                status:HTTP_STATUS.UNPROCESSABLE_ENTITY
              })
            }

            req.slugOfCourse = slug;
            return true;
          } catch(error:any){
            throw error
          }
       }
     }
   },
  teacherId:{
     notEmpty:true,
  },
  lessonId:{
     notEmpty:true,
  }

},['body']))


export const updateCourseValidation = validate(checkSchema({
  title:{
    custom: {
      options: async (value, {req}) => {
        if(value === ''){
          return true;
        }

        const newTitle = value.trim();
        const newSlug = createSlug(newTitle);

        try{
          const course = await databaseService.courses.findOne({slug: newSlug});
          if(course){
            throw new ErrorWithStatus({
              message:"Slug has existed",
              status:HTTP_STATUS.UNPROCESSABLE_ENTITY
            })
          }

          req.course = {
            ...req.body,
            slug:newSlug
          }
          return true;

        }catch(error:any){
          throw error
        }
      }
    }
  }
},['body']))


export const deleteCourseValidation = validate(checkSchema({
  id:{
    notEmpty:true,
    trim:true,
    custom:{
      options: async (value, {req}) => {
        try {
          const course = await databaseService.courses.findOne({_id:new ObjectId(value)});
          if(!course){
            throw new ErrorWithStatus({
              message:"Course not exist",
              status: HTTP_STATUS.UNPROCESSABLE_ENTITY
            })
          }

          req.course = course;
        } catch (error:any){
          throw error
        }
      }
    }
  }
},['params']))