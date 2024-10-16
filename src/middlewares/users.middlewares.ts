import { checkSchema } from 'express-validator';
import usersService from '~/services/users.services';
import validate from '~/utils/validate';

export const loginValidation = validate(checkSchema({
  email: {
    isEmail: {
      errorMessage: 'Must be a valid email address',
    },
    isEmpty: {
      negated: true, // Đảm bảo email không bị trống
      errorMessage: 'Email is required',
    },
    trim: true,
    escape: true
  },
  password: {
    isLength: {
      options: { min: 4 }, // Mật khẩu tối thiểu 4 ký tự (cho trường hợp admin)
      errorMessage: 'Password must be at least 4 characters long',
    },
    isEmpty: {
      negated: true, // Đảm bảo password không bị trống
      errorMessage: 'Password is required',
    },
    trim: true,
    escape: true
  }
}));



export const registerValidation = validate(checkSchema({
    email: {
      isEmail: {
        errorMessage: 'Must be a valid e-mail address',
      },
      isEmpty: {
        negated: true,
        errorMessage: 'Email is required',
      },
      custom:{
        options: async (value)=> {
            const flag:boolean = await usersService.checkEmailExist(value);
            return flag;
        },
        errorMessage:"This email have existed"
      },
      trim: true,
      escape: true
    },
    password: {
      isEmpty: {
        negated: true,
        errorMessage: 'Password is required',
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minUppercase: 1,
          minLowercase: 1,
          minNumbers: 1,
          minSymbols: 1
        },
        errorMessage: 'The password must be strong, including at least one uppercase letter, one lowercase letter, one number, and one special character.'
      },
      trim: true,
      escape: true
    },
    confirmPassword: {
      isEmpty: {
        negated: true,
        errorMessage: 'Confirm password is required',
      },
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            return false;
          }
          return true;
        },
        errorMessage:'Passwords do not match'
      },
      errorMessage: 'Confirm Password must match the Password.',
      trim: true,
      escape: true
    }
  }));
  