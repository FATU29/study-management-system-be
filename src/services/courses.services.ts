import { Course } from '~/models/schemas/course.schema'
import databaseService from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { CourseRequest } from '~/controllers/request/course.request'
import { title } from 'node:process'

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

  async getCourseForStudentService(enrollmentId: string) {
    const courses = await databaseService.courses.aggregate([
      {
        $match: {
          enrollmentIds: enrollmentId
        }
      },
      {
        $addFields: {
          teacherObjectIds: {
            $map: {
              input: '$teacherIds',
              as: 'id',
              in: { $toObjectId: '$$id' }  // Convert string IDs to ObjectId
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'teacherObjectIds',
          foreignField: '_id',
          as: 'teacherDetails'
        }
      },
      {
        $project: {
          _id: 1,
          title: 1,
          teacherIds: 1,
          teacherDetails: {
            $map: {
              input: '$teacherDetails',
              as: 'teacher',
              in: {
                _id: '$$teacher._id',
                firstName: '$$teacher.firstName',
                lastName: '$$teacher.lastName',
                email: '$$teacher.email',
                role: '$$teacher.role'
              }
            }
          }
        }
      }
    ]).toArray();
  
    return courses;
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
                in: { $toObjectId: '$$id' } // Chuyển từng phần tử trong mảng teacherId thành ObjectId
              }
            },
            enrollmentId: {
              $map: {
                input: '$enrollmentId',
                as: 'id',
                in: { $toObjectId: '$$id' } // Chuyển từng phần tử trong mảng enrollmentId thành ObjectId
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
          teacherId: teacherId
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
          enrollmentId: enrollmentId
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
          enrollmentId: enrollmentId
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
          teacherId: teacherId
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
          teacherId: teacherIds
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
          enrollmentId: enrollmentIds
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
          enrollmentId: {
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
          teacherId: {
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
            teacherId: {
              $map: {
                input: '$teacherId',
                as: 'id',
                in: { $toObjectId: '$$id' } // Chuyển từng phần tử trong mảng teacherId thành ObjectId
              }
            },
            enrollmentId: {
              $map: {
                input: '$enrollmentId',
                as: 'id',
                in: { $toObjectId: '$$id' } // Chuyển từng phần tử trong mảng enrollmentId thành ObjectId
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
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray()

      return data

  }
}


const courseServices = new CoursesServices()
export default courseServices
