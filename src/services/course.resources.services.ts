import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import { ICourseResource } from '~/models/schemas/course.resource.schema'

class CourseResourcesService {
  async getCourseResources(courseId: string) {
    const course = databaseService.courseResources.find({ courseId: ObjectId.createFromHexString(courseId) })
    if (!course) {
      throw new Error(`Course with id "${courseId}" not exist`)
    }
    const courseResources = await course.toArray()
    return courseResources
  }

  async addCourceResources(resource: ICourseResource) {
    resource.createdAt = new Date()
    resource.updatedAt = resource.createdAt
    return await databaseService.courseResources.insertOne(resource)
  }

  async updateCourseResource(resource: ICourseResource) {
    // The createdAt should not be included in the parameters to be updated
    return await databaseService.courseResources.findOneAndUpdate(
      { _id: resource._id },
      {
        $set: {
          ...resource
        },
        $currentDate: {
          updatedAt: true
        }
      },
      {
        returnDocument: 'after',
        upsert: false
      }
    )
  }

  async deleteCourseResource(resourceId: string) {
    const resource = await databaseService.courseResources.findOne({ _id: ObjectId.createFromHexString(resourceId) })
    if (!resource) {
      throw new Error(`Resource with id "${resourceId}" not exist`)
    }
    await databaseService.courseResources.deleteOne({ _id: ObjectId.createFromHexString(resourceId) })
    return resource
  }
}

const courseResourcesService = new CourseResourcesService()
export default courseResourcesService
