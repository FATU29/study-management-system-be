import databaseService from '../src/services/database.services'

const initData = async () => {
  try {
    const existingRoles = await databaseService.role.find({}).toArray()

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
  }
}

initData().catch(console.dir)