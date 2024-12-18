import express, { NextFunction, Request, RequestHandler, Response } from 'express'
import _ from 'lodash'
import multer from 'multer'
import HTTP_STATUS from '~/constants/httpstatus'
import { downloadFileController, uploadFilesController } from '~/controllers/files.controllers'
import { downloadingFileValidation } from '~/middlewares/files.middlewares'
import { accessTokenValidation } from '~/middlewares/users.middlewares'
import { ErrorWithStatus } from '~/models/Errors'
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
        return next(
          new ErrorWithStatus({
            status: HTTP_STATUS.BAD_REQUEST,
            message: `The size of each size should not exceed ${MAXIMUM_FILE_SIZE_ALLOWED / 1024 / 1024}MB`
          })
        )
      case 'LIMIT_FILE_COUNT':
        return next(
          new ErrorWithStatus({
            status: HTTP_STATUS.BAD_REQUEST,
            message: `The number of files sent should not exceed ${MAXIMUM_FILE_COUNT_ALLOWED}`
          })
        )
      default:
        return next(
          new ErrorWithStatus({
            status: HTTP_STATUS.BAD_REQUEST,
            message: 'Something went wrong when trying to upload files: ' + err.message
          })
        )
    }
  }
}

fileRouter.use(multerErrorHandler)

// query: sourceId=...
fileRouter.post('/upload', accessTokenValidation, multerParser.any(), simpleControlWrapper(uploadFilesController))

fileRouter.get(
  '/download',
  accessTokenValidation,
  downloadingFileValidation,
  simpleControlWrapper(downloadFileController)
)

// TODO: Update file name
fileRouter.patch('/update', accessTokenValidation, (req, res) => {
  res.send('File updated')
})

// only uploader can delete files
fileRouter.delete('/delete', accessTokenValidation, (req, res) => {
  res.send('File deleted')
})

export default fileRouter
