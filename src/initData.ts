import databaseService from '../src/services/database.services'
import { UserVerifyStatus } from './constants/enum'
import { hashBcrypt } from './utils/crypto'

const initData = async () => {
  try {
    const existingRoles = await databaseService.role.find({}).toArray()
    const existingTeacher = await databaseService.users.findOne({email:"teacher@gmail.com"});
    const existingAdmin = await databaseService.users.findOne({email:"admin@gmail.com"});

    if(!existingTeacher){
      await  databaseService.users.insertOne({
        email:"teacher@gmail.com",
        password: await hashBcrypt("Teacher@123"),
        verify: UserVerifyStatus.Verified,
        role:"TEACHER",
        firstName:"Teacher",
        lastName:"Test",
      })
      console.log("Teacher-Account initialized successfully")
    } else {
      console.log("Teacher-Account already exists")
    }

    if(!existingAdmin){
      await databaseService.users.insertOne({
        email:"admin@gmail.com",
        password: await hashBcrypt("Admin@123"),
        verify: UserVerifyStatus.Verified,
        role:"ADMIN",
        firstName:"Admin",
        lastName:"Test",
      })
      console.log("Admin-Account initialized successfully")

    } else {
      console.log("Teacher-Account already exists")
    }


    if (existingRoles.length === 0) {
      await databaseService.role.insertMany([
        { name: "TEACHER" },
        { name: "USER" },
        {name: "ADMIN"}
      ])


      console.log("Roles initialized successfully")
    } else {
      console.log("Roles already exist, skipping initialization")
    }

  } catch (e: any) {
    console.error("Init error:", e.message)
  } finally {
    await databaseService.disconnect();
  }
}

initData().catch(console.dir)
