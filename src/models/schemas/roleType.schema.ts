import { ObjectId } from 'mongodb'


export interface IRoleType {
  _id?:ObjectId,
  name:string,
}



export class RoleType {
  _id?:ObjectId
  name:string

  constructor(roleType:IRoleType) {
    this._id = roleType._id;
    this.name = roleType.name
  }
}