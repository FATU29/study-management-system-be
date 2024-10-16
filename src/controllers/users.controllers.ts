import { Request, Response } from 'express'
import usersService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  res.json({
    data: {
      email: email,
      password: password
    }
  })
}

export const registerController = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const result = await usersService.register({ email, password });
        res.status(200).json({
            code: 200,
            title: 'Register Account',
            status: 'success',
            result
        });
    } catch (error) {
      res.status(400).json({
        code: 400,
        title: 'Register Account',
        status: 'error',
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  };
