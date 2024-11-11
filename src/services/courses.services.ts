import { Course } from '~/models/schemas/course.schema'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { CourseRequest } from '~/controllers/request/course.request'

class CoursesServices {
  async createCourse(course: Course) {
    return await databaseService.courses.insertOne(course)
  }

  async getCourse(slug: string) {
    return await databaseService.courses.findOne({ slug: slug })
  }

  async updateCourse(_id: ObjectId, data: CourseRequest) {
    return await databaseService.courses.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          ...data,
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after'
      }
    )
  }

  async deleteCourse(_id: ObjectId) {
    return await databaseService.courses.deleteOne({ _id: _id });
  }
}

const courseServices = new CoursesServices()
export default courseServices