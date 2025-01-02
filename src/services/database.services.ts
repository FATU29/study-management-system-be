import { Collection, Db, GridFSBucket, GridFSFile, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/user.schema'
import RefreshToken from '~/models/schemas/refreshtoken.schema'
import { Course } from '~/models/schemas/course.schema'
import { RoleType } from '~/models/schemas/roleType.schema'
import { Notification } from '~/models/schemas/notification.schema'
import { CourseResource } from '~/models/schemas/course.resource.schema'
import { Submission } from '~/models/schemas/submission.schema'
dotenv.config()

// Replace the uri string with your connection string.
const uri = process.env.DATABASE_URI
const dbName = process.env.DATABASE_NAME

const bucketName = 'fs'

class DatabaseService {
  private client: MongoClient
  private database: Db

  private gridFSBucket: GridFSBucket

  constructor() {
    this.client = new MongoClient(uri as string)
    this.database = this.client.db(dbName)

    this.gridFSBucket = new GridFSBucket(this.database, {
      bucketName: bucketName
    })
  }

  async connect() {
    try {
      await this.client.connect()
      await this.database.command({ ping: 1 })
      console.log('Connected successfully to server')
    } catch (error) {
      console.error('Connection failed:', error)
      await this.client.close()
    }
  }

  async disconnect() {
    await this.client.close()
  }

  get users(): Collection<User> {
    return this.database.collection('users')
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.database.collection('refresh_tokens')
  }

  get courses(): Collection<Course> {
    return this.database.collection('courses')
  }

  get role(): Collection<RoleType> {
    return this.database.collection('roles')
  }

  get notifications(): Collection<Notification> {
    return this.database.collection('notifications')
  }

  get courseResources(): Collection<CourseResource> {
    return this.database.collection('course_resources')
  }

  get submissions(): Collection<Submission> {
    return this.database.collection('submissions')
  }

  get bucket(): GridFSBucket {
    return this.gridFSBucket
  }

  get files(): Collection<GridFSFile> {
    return this.database.collection(`${bucketName}.files`)
  }
}

const databaseService = new DatabaseService()
export default databaseService
