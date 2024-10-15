import User from '~/models/schemas/user.schema'
import databaseService from './database.services'

class UsersService {
    async register(payload: { email: string; password: string }) {
      const { email, password } = payload;
      const newUser = new User({
        email,
        password
      });
      const result = await databaseService.users.insertOne(newUser)
      return {
        ...newUser,
      };
    }

    async checkEmailExist(email:string){
       const result = databaseService.users.findOne({email});
       return Boolean(result);
    }
  }

const usersService = new UsersService()
export default usersService
