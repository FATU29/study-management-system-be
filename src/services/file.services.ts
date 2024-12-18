import { FileMetadata, IFile } from '~/models/schemas/file.schema'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpstatus'
import { ErrorWithStatus } from '~/models/Errors'

const bucket = databaseService.bucket

class FileService {
  async uploadFile(file: Express.Multer.File, uploaderId: string, sourceId?: string) {
    const fileMetadata: FileMetadata = {
      uploaderId: new ObjectId(uploaderId),
      sourceId: sourceId ? new ObjectId(sourceId) : undefined,
      mimetype: file.mimetype
    }

    return new Promise<IFile>((resolve, reject) => {
      const uploadStream = bucket.openUploadStream(file.originalname, {
        metadata: fileMetadata
      })

      uploadStream.on('finish', () => {
        const fileInfo: IFile = {
          _id: uploadStream.id,
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          uploadDate: uploadStream.gridFSFile?.uploadDate ?? new Date()
        }
        resolve(fileInfo)
      })

      uploadStream.on('error', (error) => {
        reject(error)
      })

      uploadStream.end(file.buffer)
    })
  }

  async downloadFile(fileId: string, userId: string, sourceId?: string) {
    const file = await bucket
      .find({
        _id: new ObjectId(fileId)
      })
      .limit(1)
      .next()

    if (!file) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.NOT_FOUND,
        message: `File with id "${fileId}" does not exist`
      })
    }

    if (file?.metadata?.uploaderId !== userId || (sourceId && file?.metadata?.sourceId !== sourceId)) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.FORBIDDEN,
        message: 'You are not allowed to download this file'
      })
    }

    const fileInfo: IFile = {
      _id: file._id,
      filename: file.filename,
      mimetype: file.metadata.mimetype,
      size: file.length,
      uploadDate: file.uploadDate
    }

    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId))

    return { fileInfo, downloadStream }
  }
}

const fileService = new FileService()
export default fileService
