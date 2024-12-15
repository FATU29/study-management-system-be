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
          ...data
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
    return await databaseService.courses.deleteOne({ _id: _id })
  }

  async getCourseForAdminService() {
    const data = await databaseService.courses
      .aggregate([
        {
          $addFields: {
            teacherId: {
              $map: {
                input: '$teacherId',
                as: 'id',
                in: { $toObjectId: '$$id' }
              }
            },
            enrollmentId: {
              $map: {
                input: '$enrollmentId',
                as: 'id',
                in: { $toObjectId: '$$id' }
              }
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'teacherId',
            foreignField: '_id',
            as: 'teacherDetails'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'enrollmentId',
            foreignField: '_id',
            as: 'enrollmentDetails'
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            teacherDetails: 1,
            enrollmentDetails: 1
          }
        },
        {
          $addFields: {
            teacherDetails: {
              $map: {
                input: '$teacherDetails',
                as: 'teacher',
                in: {
                  _id: '$$teacher._id',
                  firstName: '$$teacher.firstName',
                  lastName: '$$teacher.lastName',
                  email: '$$teacher.email'
                }
              }
            },
            enrollmentDetails: {
              $map: {
                input: '$enrollmentDetails',
                as: 'enrollment',
                in: {
                  _id: '$$enrollment._id',
                  firstName: '$$enrollment.firstName',
                  lastName: '$$enrollment.lastName',
                  email: '$$enrollment.email'
                }
              }
            }
          }
        }
      ])
      .toArray()

    return data
  }

  async deleteTecherInCourse(courseId: ObjectId, teacherId: string) {
    return await databaseService.courses.updateOne(
      {
        _id: courseId
      },
      {
        $pull: {
          teacherIds: teacherId
        }
      }
    )
  }
  
  async deleteEnrollmentInCourse(courseId: ObjectId, enrollmentId: string) {
    return await databaseService.courses.updateOne(
      {
        _id: courseId
      },
      {
        $pull: {
          enrollmentIds: enrollmentId
        }
      }
    )
  }

  async addEnrollmentInCourse(courseId: ObjectId, enrollmentId: string) {
    return await databaseService.courses.updateOne(
      {
        _id: courseId
      },
      {
        $push: {
          enrollmentIds: enrollmentId
        }
      }
    )
  }


  async addTeacherInCourse(courseId: ObjectId, teacherId: string){
    return await databaseService.courses.updateOne(
      {
        _id: courseId
      },
      {
        $push: {
          teacherIds: teacherId
        }
      }
    )
  }

  async delteSomeTeacherInCourse(courseId: ObjectId, teacherIds: string[]){
    return await databaseService.courses.updateOne(
      {
        _id: courseId
      },
      {
        $pullAll: {
          teacherIds: teacherIds
        }
      }
    )
  }

  async deleteSomeEnrollmentsInCourse(courseId: ObjectId, enrollmentIds: string[]){
    return await databaseService.courses.updateOne(
      {
        _id: courseId
      },
      {
        $pullAll: {
          enrollmentIds: enrollmentIds
        }
      }
    )
  }

  async addSomeEnrollmentsInCourse(courseId: ObjectId, enrollmentIds: string[]){
    return await databaseService.courses.updateOne(
      {
        _id: courseId
      },
      {
        $addToSet: {
          enrollmentIds: {
            $each: enrollmentIds
          }
        }
      }
    )
  }

  async addSomeTeachersInCourse(courseId: ObjectId, teacherIds: string[]){
    return await databaseService.courses.updateOne(
      {
        _id: courseId
      },
      {
        $addToSet: {
          teacherIds: {
            $each: teacherIds
          }
        }
      }
    )
  }

  async paginatioCourseService(page:number ,perPage:number){
    const data = await databaseService.courses
      .aggregate([
        {
          $addFields: {
            teacherIds: {
              $map: {
                input: '$teacherIds',
                as: 'id',
                in: { $toObjectId: '$$id' } 
              }
            },
            enrollmentIds: {
              $map: {
                input: '$enrollmentIds',
                as: 'id',
                in: { $toObjectId: '$$id' } 
              }
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'teacherIds',
            foreignField: '_id',
            as: 'teacherDetails'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'enrollmentIds',
            foreignField: '_id',
            as: 'enrollmentDetails'
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            teacherDetails: 1,
            enrollmentDetails: 1
          }
        },
        {
          $addFields: {
            teacherDetails: {
              $map: {
                input: '$teacherDetails',
                as: 'teacher',
                in: {
                  _id: '$$teacher._id',
                  firstName: '$$teacher.firstName',
                  lastName: '$$teacher.lastName',
                  email: '$$teacher.email'
                }
              }
            },
            enrollmentDetails: {
              $map: {
                input: '$enrollmentDetails',
                as: 'enrollment',
                in: {
                  _id: '$$enrollment._id',
                  firstName: '$$enrollment.firstName',
                  lastName: '$$enrollment.lastName',
                  email: '$$enrollment.email'
                }
              }
            }
          }
        }
      ])
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray()

      return data

  }
}


const courseServices = new CoursesServices()
export default courseServices
