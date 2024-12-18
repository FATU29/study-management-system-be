import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpstatus'
import { ErrorWithStatus } from '~/models/Errors'
import { DownloadFileRequestBody, UploadFileRequestQuery, UploadFileRequest } from './request/file.request'
import { IFile } from '~/models/schemas/file.schema'
import fileService from '~/services/file.services'

export const uploadFilesController = async (
  req: UploadFileRequest<ParamsDictionary, any, any, UploadFileRequestQuery>,
  res: Response
) => {
  const uploaderId = req.decoded_authorization.user_id.toString()
  const sourceId = req.query.sourceId

  const files = req.files
  if (files.length === 0) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.BAD_REQUEST,
      message: 'No files were able to be processed while uploading'
    })
  }

  const fileInfoMapper: IFile[] = []
  const uploadPromises = files.map(async (file) => fileService.uploadFile(file, uploaderId, sourceId))

  await Promise.all(uploadPromises)
    .then(() => {
      res.json({
        message: 'Files uploaded successfully',
        status: HTTP_STATUS.OK,
        data: Array.from(fileInfoMapper)
      })
    })
    .catch((error: any) => {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: error.message,
        status: HTTP_STATUS.BAD_REQUEST
      })
    })
}

export const downloadFileController = async (
  req: Request<ParamsDictionary, any, DownloadFileRequestBody>,
  res: Response
) => {
  const userId = req.decoded_authorization.user_id.toString()
  const sourceId = req.body.sourceId
  const fileId = req.body.fileId

  try {
    const { fileInfo, downloadStream } = await fileService.downloadFile(fileId, userId, sourceId)

    res.setHeader('Content-Type', fileInfo.mimetype)
    res.setHeader('Content-Disposition', `attachment; filename="${fileInfo.filename}"`)
    res.setHeader('Content-Length', fileInfo.size.toString())

    downloadStream.pipe(res)
  } catch (error: any) {
    if (error instanceof ErrorWithStatus) {
      res.status(error.status).json({
        message: error.message,
        status: error.status
      })
    } else {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: `Something's wrong happened while trying to download file: ${error.message}`,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      })
    }
  }
}
