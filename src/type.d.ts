
import * as express from 'express';
import { TokenPayload } from './controllers/request/user.request';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      decoded_Authorization: TokenPayload,
      decoded_refreshToken: TokenPayload,
    }
  }
}