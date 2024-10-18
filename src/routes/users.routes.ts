import express from 'express'
import { loginController, registerController } from '~/controllers/users.controllers';
import { loginValidation, registerValidation } from '~/middlewares/users.middlewares';






const usersRouter = express.Router();


usersRouter.post('/login',loginValidation ,loginController);
usersRouter.post('/register',registerValidation,registerController)

export default usersRouter;