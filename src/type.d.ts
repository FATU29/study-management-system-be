
import * as express from 'express';
import { TokenPayload } from './controllers/request/user.request';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      decoded_authorization: TokenPayload,
      decoded_refreshToken: TokenPayload,
      decoded_verify_email_token: TokenPayload,
      decoded_verify_forgot_password_token: TokenPayload,
    }
  }
}