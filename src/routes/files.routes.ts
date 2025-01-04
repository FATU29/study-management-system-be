import express, { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import multer from 'multer'
import HTTP_STATUS from '~/constants/httpstatus'
import {
  deleteFileController,
  downloadFileController,
  getPersonalFilesController,
  uploadFilesController
} from '~/controllers/files.controllers'
import { fileIdentityValidation, fileQueryValidation } from '~/middlewares/files.middlewares'
import { accessTokenValidation } from '~/middlewares/users.middlewares'
import { MAXIMUM_FILE_COUNT_ALLOWED, MAXIMUM_FILE_SIZE_ALLOWED } from '~/models/schemas/file.schema'
import { simpleControlWrapper } from '~/utils/handler'

const fileRouter = express.Router()

const multerParser = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAXIMUM_FILE_SIZE_ALLOWED,
    files: MAXIMUM_FILE_COUNT_ALLOWED
  }
})

const multerErrorHandler = async (err: ErrorCallback, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        res.status(HTTP_STATUS.BAD_REQUEST).send({
          status: HTTP_STATUS.BAD_REQUEST,
          message: `The individual file size sent should not exceed ${MAXIMUM_FILE_SIZE_ALLOWED / 1024 / 1024} MB`
        })
        return
      case 'LIMIT_FILE_COUNT':
        res.status(HTTP_STATUS.BAD_REQUEST).send({
          status: HTTP_STATUS.BAD_REQUEST,
          message: `The number of files sent should not exceed ${MAXIMUM_FILE_COUNT_ALLOWED}`
        })
        return
      default:
        res.status(HTTP_STATUS.BAD_REQUEST).send({
          status: HTTP_STATUS.BAD_REQUEST,
          message: `An error happened while trying to upload the file: ${err.message}`
        })
        return
    }
  }
  next(err)
}

// query: sourceId=...
fileRouter.post(
  '/upload',
  accessTokenValidation,
  multerParser.any(),
  multerErrorHandler,
  simpleControlWrapper(uploadFilesController)
)

// mode: 'attachment' or 'inline'; default: 'attachment'
fileRouter.get(
  '/download',
  accessTokenValidation,
  // fileIdentityValidation,
  fileQueryValidation,
  simpleControlWrapper(downloadFileController)
)

fileRouter.get('/limits', (_req, res) => {
  res.send({
    maxFileSize: MAXIMUM_FILE_SIZE_ALLOWED,
    maxFileCount: MAXIMUM_FILE_COUNT_ALLOWED
  })
})

fileRouter.get(
  '/get-personal-files/:sourceId?',
  accessTokenValidation,
  simpleControlWrapper(getPersonalFilesController)
)

// // Optional: update the file name (not implemented)
// fileRouter.patch('/update', accessTokenValidation, (req, res) => {
//   res.send('File updated')
// })

// only uploader can delete files
fileRouter.delete('/delete', accessTokenValidation, fileQueryValidation, simpleControlWrapper(deleteFileController))

export default fileRouter
