import { ObjectId } from 'mongodb'
import databaseService from './database.services'

class SearchService {
  async searchUsersNotJoinCourse({ courseId, content }: { courseId?: ObjectId; content: string }) {
    if (!content) return null

    if (courseId) {
      const course = await databaseService.courses.findOne({ _id: courseId })
      const arrayUserInCourse = course?.enrollmentIds || []

      const data = await databaseService.users
        .aggregate([
          {
            $match: {
              _id: { $nin: arrayUserInCourse },
              $or: [
                { firstName: { $regex: content, $options: 'i' } },
                { lastName: { $regex: content, $options: 'i' } },
                { email: { $regex: content, $options: 'i' } }
              ]
            }
          },
          {
            $project: {
              password: 0
            }
          }
        ])
        .toArray()

      return data
    } else {
      const data = await databaseService.users
        .aggregate([
          {
            $match: {
              role: 'USER',
              $or: [
                { firstName: { $regex: content, $options: 'i' } },
                { lastName: { $regex: content, $options: 'i' } },
                { email: { $regex: content, $options: 'i' } }
              ]
            }
          },
          {
            $project: {
              password: 0
            }
          }
        ])
        .toArray()

      return data
    }
  }

  async searchTeachersNotJoinCourse({ courseId, content }: { courseId?: ObjectId; content: string }) {
    if (!content) return null
    if (courseId) {
      const course = await databaseService.courses.findOne({ _id: courseId })
      const arrayTeachers = course?.teacherIds
      const data = await databaseService.users
        .aggregate([
          {
            $match: {
              _id: {
                $nin: arrayTeachers
              },
              $or: [
                {
                  firstName: {
                    $regex: content,
                    $options: 'i'
                  }
                },
                {
                  lastName: {
                    $regex: content,
                    $options: 'i'
                  }
                },
                {
                  email: {
                    $regex: content,
                    $options: 'i'
                  }
                }
              ]
            }
          },
          {
            $project: {
              password: 0
            }
          }
        ])
        .toArray()
      return data
    } else {
      const data = await databaseService.users
        .aggregate([
          {
            $match: {
              role: 'TEACHER'
            }
          },
          {
            $match: {
              $or: [
                {
                  firstName: {
                    $regex: content,
                    $options: 'i'
                  }
                },
                {
                  lastName: {
                    $regex: content,
                    $options: 'i'
                  }
                },
                {
                  email: {
                    $regex: content,
                    $options: 'i'
                  }
                }
              ]
            }
          },
          {
            $project: {
              password: 0
            }
          }
        ])
        .toArray()
      return data
    }
  }

  async searchCoursesController(content: string, page: number = 1, perPage: number = 5) {
    if (!content) return null
    const data = await databaseService.courses
      .aggregate([
        {
          $match: {
            title: { $regex: content, $options: 'i' }
          }
        }
      ])
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray()

    return data
  }

  async searchTeachersJoinCourse({ courseId, content }: { courseId?: ObjectId; content: string }) {
    if (!content) return null

    if (courseId) {
      const course = await databaseService.courses.findOne({ _id: courseId })
      const arrayTeachers = course?.teacherIds?.map((id) => new ObjectId(id))

      if (!arrayTeachers || arrayTeachers.length === 0) return []

      const data = await databaseService.users
        .aggregate([
          {
            $match: {
              _id: { $in: arrayTeachers }
            }
          },
          {
            $project: {
              password: 0
            }
          }
        ])
        .toArray()

      return data
    }

    return []
  }

  async searchUsersJoinCourse({ courseId, content }: { courseId?: ObjectId; content: string }) {
    if (!content) return null
    if (courseId) {
      const course = await databaseService.courses.findOne({ _id: courseId })
      const arrayEnrollment = course?.enrollmentIds?.map((id) => new ObjectId(id))
      const data = await databaseService.users
        .aggregate([
          {
            $match: {
              _id: {
                $in: arrayEnrollment
              }
            }
          },
          {
            $project: {
              password: 0
            }
          }
        ])
        .toArray()
      return data
    }
    return []
  }

  async searchCourse(content: string, page: number, perPage: number) {
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return { rows: [], length: 0 };
    }

    try {
      const skip = (page - 1) * perPage
      const limit = perPage

      const data = await databaseService.courses
        .aggregate([
          {
            $match: {
              $or: [
                { title: { $regex: content, $options: 'i' } },
              ]
            }
          },
          { $skip: skip },
          { $limit: limit }
        ])
        .toArray()

        const lengthArray = await databaseService.courses
        .aggregate([
          {
            $match: {
              $or: [
                { title: { $regex: content, $options: 'i' } },
              ]
            }
          },
          {
            $count: "totalCount"
          }
        ]).toArray();
      
      const totalCount = lengthArray.length > 0 ? lengthArray[0].totalCount : 0;
      

      return {
        rows: data,
        length: totalCount
      }
    } catch (error) {
      console.error('Error in searchCourse:', error)
      throw new Error('Failed to fetch search results')
    }
  }
}

const searchService = new SearchService()
export default searchService
