import { Collection, Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/user.schema'
import RefreshToken from '~/models/schemas/refreshtoken.schema'
import { Course } from '~/models/schemas/course.schema'
import { RoleType } from '~/models/schemas/roleType.schema'
dotenv.config()

// Replace the uri string with your connection string.
const uri = process.env.DATABASE_URI
const dbName = process.env.DATABASE_NAME


class DatabaseService {
  private client: MongoClient
  private database: Db

  constructor() {
    this.client = new MongoClient(uri as string)
    this.database = this.client.db(dbName);
  }
  
  async connect() {
    try {
      await this.client.connect();
      await this.database.command({ ping: 1 });
      console.log('Connected successfully to server')
    } catch (error) {
      console.error('Connection failed:', error)
      await this.client.close()
    }
  }

  async disconnect(){
    await this.client.close();
  }


  get users():Collection<User>{
    return this.database.collection('users');
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.database.collection("refresh_tokens")
  }

  get courses():Collection<Course> {
    return this.database.collection("courses");
  }

  get role():Collection<RoleType>{
    return this.database.collection("roles");
  }
}

const databaseService = new DatabaseService()
export default databaseService