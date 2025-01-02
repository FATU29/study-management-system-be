import { FileMetadata, IFile } from '~/models/schemas/file.schema'
import databaseService from './database.services'
import { ObjectId } from 'mongodb'
import HTTP_STATUS from '~/constants/httpstatus'
import { ErrorWithStatus } from '~/models/Errors'

const bucket = databaseService.bucket
const fsFiles = databaseService.files

class FileService {
  async uploadFile(file: Express.Multer.File, uploaderId: string, sourceId?: string) {
    const fileMetadata: FileMetadata = {
      uploaderId: new ObjectId(uploaderId),
      sourceId: sourceId,
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

  // sourceId is optional, if not provided, it will return all files uploaded by the owner
  // sourceId may be useful when getting the files in a class resource.
  async getFilesInfo(ownerId: string, sourceId?: string) {
    const query: Record<string, any> = { 'metadata.uploaderId': new ObjectId(ownerId) }
    if (sourceId) {
      query['metadata.sourceId'] = sourceId
    } else {
      query['$or'] = [
        { 'metadata.sourceId': null }, // The usual case when the uploaded file is not given a sourceId
        { 'metadata.sourceId': { $exists: false } } // Should not be in this case, just be cautious
      ]
    }

    const files = await bucket.find(query).toArray()

    return files.map((file) => {
      const fileInfo: IFile = {
        _id: file._id,
        filename: file.filename,
        mimetype: file?.metadata?.mimetype,
        size: file.length,
        uploadDate: file.uploadDate
      }
      return fileInfo
    })
  }

  async updateFileMetadata(fileId: string, metadata: Partial<FileMetadata>) {
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

    await fsFiles.updateOne(
      { _id: new ObjectId(fileId) },
      {
        $set: {
          metadata: {
            ...file.metadata,
            ...metadata
          }
        }
      }
    )
  }

  async downloadFile(fileId: string, requesterId: string, sourceId?: string) {
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

    if (file?.metadata?.uploaderId.toString() !== requesterId) {
      if (!sourceId || file?.metadata?.sourceId.toString() !== sourceId) {
        throw new ErrorWithStatus({
          status: HTTP_STATUS.FORBIDDEN,
          message: 'You are not allowed to download this file'
        })
      }
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

  // bypassOwnershipCheck allows teachers of the same course or admin to delete files uploaded by other teachers
  // Should having checked the delete permission if bypassOwnershipCheck is allowed before calling this method
  async deleteFile(fileId: string, ownerId: string, bypassOwnershipCheck = false) {
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

    if (!bypassOwnershipCheck && file?.metadata?.uploaderId.toString() !== ownerId) {
      throw new ErrorWithStatus({
        status: HTTP_STATUS.FORBIDDEN,
        message: 'You are not allowed to delete this file'
      })
    }

    await bucket.delete(new ObjectId(fileId))

    const fileInfo: IFile = {
      _id: file._id,
      filename: file.filename,
      mimetype: file?.metadata?.mimetype,
      size: file.length,
      uploadDate: file.uploadDate
    }
    return fileInfo
  }
}

const fileService = new FileService()
export default fileService
