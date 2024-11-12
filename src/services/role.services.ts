import databaseServices from '~/services/database.services'
import { RoleType } from '~/models/schemas/roleType.schema'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'


class RoleService {
  async createRole(role:RoleType){
    return await databaseServices.role.insertOne(role);
  }
  async updateRole(_id:ObjectId,newRole:RoleType){
    return await databaseServices.role.findOneAndUpdate({_id},{
      $set:{
        ...newRole
      },
      $currentDate:{
        updated_at: true,
      }
    },{
      returnDocument: 'after'
    })
  }
  async deleteRole(_id:ObjectId) {
    return await databaseServices.role.deleteOne(_id);
  }

  async getRole (_id:ObjectId) {
    return await databaseService.users.findOne({_id})
  }
}


const roleService: RoleService = new RoleService();
export default roleService;