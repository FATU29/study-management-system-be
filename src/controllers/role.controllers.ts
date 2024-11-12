import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { CourseRequest } from '~/controllers/request/course.request'
import { IRoleType, RoleType } from '~/models/schemas/roleType.schema'
import { ObjectId } from 'mongodb'
import roleService from '~/services/role.services'
import HTTP_STATUS from '~/constants/httpstatus'


export const addRoleController = async (
  req: Request<ParamsDictionary, any, IRoleType>,
  res: Response,
) => {

  const name = req.body.name.toUpperCase();
  const _id = new ObjectId();
  const role = new RoleType({_id,name});

  const result = await roleService.createRole(role);

  res.json({
    message:"Add role successfully",
    status:HTTP_STATUS.OK,
    data:result
  })
}




export const getRoleController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
) => {
  const _id = new ObjectId(req.params._id);

  const result = await roleService.getRole(_id);

  res.json({
    message:"Get role successfully",
    status:HTTP_STATUS.OK,
    data:result
  })
}

export const deleteRoleController = async (
  req: Request<ParamsDictionary, any, any>,
  res: Response,
) => {
  const _id = new ObjectId(req.params._id);

  const result = await roleService.deleteRole(_id);

  res.json({
    message:"Delete role successfully",
    status:HTTP_STATUS.OK,
  })
}

export const updateRoleController = async (
  req: Request<ParamsDictionary, any, any>,
  res:Response
) => {
  const _id = new ObjectId(req.params._id);
  const name = req.body.name.toUpperCase();

  const newRole = new RoleType({name});

  const result = await roleService.updateRole(_id, newRole);

  res.json({
    message:"Update role successfully",
    status:HTTP_STATUS.OK
  })
}
