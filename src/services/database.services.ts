import { Collection, Db, MongoClient } from 'mongodb'
import dotenv from 'dotenv'
import User from '~/models/schemas/user.schema'
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


  get users():Collection<User>{
    return this.database.collection('users');
  }
}

const databaseService = new DatabaseService()
export default databaseService