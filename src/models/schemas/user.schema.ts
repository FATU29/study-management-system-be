import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enum'

export interface UserType {
  _id?: ObjectId
  email: string
  password: string
  firstName?: string
  lastName?: string
  dateOfBirth?: Date
  role?: string
  emailVerifyToken?: string
  forgotPasswordVerifyToken?: string
  verify?: UserVerifyStatus
  avatar?: string
  coverPhoto?: string
  created_at?: Date
  updated_at?: Date
}

export default class User {
   _id?: ObjectId
   email: string
   password: string
   firstName?: string
   lastName?: string
   dateOfBirth?: Date
   role?: string
   emailVerifyToken?: string
   forgotPasswordVerifyToken?: string
   verify: number
   avatar?: string
   coverPhoto?: string
   created_at?: Date
   updated_at?: Date

  constructor(user: UserType) {
    this._id = user._id || undefined
    this.email = user.email
    this.password = user.password
    this.firstName = user.firstName
    this.lastName = user.lastName
    this.verify = user.verify as number
    this.dateOfBirth = user.dateOfBirth
    this.role = user.role
    this.emailVerifyToken = user.emailVerifyToken
    this.forgotPasswordVerifyToken = user.forgotPasswordVerifyToken
    this.avatar = user.avatar
    this.coverPhoto = user.coverPhoto
    this.created_at = user.created_at || new Date()
    this.updated_at = user.updated_at || new Date()
  }


}