import { ObjectId } from 'mongodb'
import databaseService from './database.services'

class CourseResourcesService {
  async getCourseResources(courseId: string) {
    const course = await databaseService.courses.findOne({ _id: ObjectId.createFromHexString(courseId) })
    if (!course) {
      throw new Error(`Course with id "${courseId}" not exist`)
    }
    return course.lessonId
  }
}

const courseResourcesService = new CourseResourcesService()
export default courseResourcesService
