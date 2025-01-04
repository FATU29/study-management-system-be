import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import HTTP_STATUS from '~/constants/httpstatus'
import { ErrorWithStatus } from '~/models/Errors'
import {
  UploadFilesRequestQuery,
  UploadFilesRequest,
  GetFilesInfoRequestQuery,
  DownloadFileRequestQuery,
  DeleteFileRequestQuery
} from './request/file.request'
import fileService from '~/services/file.services'

export const uploadFilesController = async (
  req: UploadFilesRequest<ParamsDictionary, any, any, UploadFilesRequestQuery>,
  res: Response
) => {
  const uploaderId = req.decoded_authorization.user_id.toString()
  const sourceId = req.query.sourceId?.trim()

  const files = req.files
  if (files.length === 0) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'No files were uploaded',
      status: HTTP_STATUS.BAD_REQUEST
    })
  }

  const uploadPromises = files.map(async (file) => fileService.uploadFile(file, uploaderId, sourceId))

  await Promise.all(uploadPromises)
    .then((filesInfo) => {
      res.json({
        message: 'Files uploaded successfully',
        status: HTTP_STATUS.OK,
        data: filesInfo
      })
    })
    .catch((error: any) => {
      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: error.message,
        status: HTTP_STATUS.BAD_REQUEST
      })
    })
}

export const getPersonalFilesController = async (
  req: Request<ParamsDictionary, any, any, GetFilesInfoRequestQuery>,
  res: Response
) => {
  const ownerId = req.decoded_authorization.user_id.toString()
  const sourceId = req.query.sourceId?.trim()

  try {
    const filesInfo = await fileService.getFilesInfo(ownerId, sourceId)

    res.json({
      message: 'The information of personal files retrieved successfully',
      status: HTTP_STATUS.OK,
      data: filesInfo
    })
  } catch (error: any) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: `Something's wrong happened while trying to get personal files: ${error.message}`,
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR
    })
  }
}

export const downloadFileController = async (
  req: Request<ParamsDictionary, any, any, DownloadFileRequestQuery>,
  res: Response
) => {
  const userId = req.decoded_authorization.user_id.toString()
  const sourceId = req.query.sourceId
  const fileId = req.query.fileId
  const inlineView = req.query.inline || false

  try {
    const { fileInfo, downloadStream } = await fileService.downloadFile(fileId, userId, sourceId)

    res.setHeader('Content-Type', fileInfo.mimetype)
    res.setHeader('Content-Disposition', `${inlineView ? 'inline' : 'attachment'}; filename="${fileInfo.filename}"`)
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

export const deleteFileController = async (
  req: Request<ParamsDictionary, any, any, DeleteFileRequestQuery>,
  res: Response
) => {
  const userId = req.decoded_authorization.user_id.toString()
  const fileId = req.query.fileId

  try {
    const deletedFileInfo = await fileService.deleteFile(fileId, userId)

    res.json({
      message: `File with id "${fileId}" deleted successfully`,
      status: HTTP_STATUS.OK,
      data: deletedFileInfo
    })
  } catch (error: any) {
    if (error instanceof ErrorWithStatus) {
      res.status(error.status).json({
        message: error.message,
        status: error.status
      })
    } else {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: `Something's wrong happened while trying to delete file: ${error.message}`,
        status: HTTP_STATUS.INTERNAL_SERVER_ERROR
      })
    }
  }
}
