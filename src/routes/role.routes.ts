import express from 'express'
import { accessTokenValidation } from '~/middlewares/users.middlewares'
import { addRoleMiddlewares,getRoleMiddlewares,deleteRoleMiddleWares ,updateRoleMiddlewares} from '~/middlewares/role.middlewares'
import { addRoleController,getRoleController,deleteRoleController,updateRoleController } from '~/controllers/role.controllers'
import { wrapRequestHandler } from '~/utils/handler'


const roleRouter = express.Router();


roleRouter.post('/add',accessTokenValidation,addRoleMiddlewares,wrapRequestHandler(addRoleController))
roleRouter.get('/:_id',accessTokenValidation,getRoleMiddlewares,wrapRequestHandler(getRoleController))
roleRouter.delete('/delete',accessTokenValidation,deleteRoleMiddleWares,wrapRequestHandler(deleteRoleController));
roleRouter.patch('/update',accessTokenValidation,updateRoleMiddlewares,wrapRequestHandler(updateRoleController));





export default roleRouter;