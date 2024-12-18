import { Request } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

export interface UploadFileRequestQuery {
  sourceId?: string
}

export interface UploadFileRequest<P = ParamsDictionary, ResBody = any, ReqBody = any, ReqQuery = any>
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  files: Express.Multer.File[]
}

export interface DownloadFileRequestBody {
  fileId: string
  sourceId?: string
}

// interface File {
//   /** Name of the form field associated with this file. */
//   fieldname: string;
//   /** Name of the file on the uploader's computer. */
//   originalname: string;
//   /**
//    * Value of the `Content-Transfer-Encoding` header for this file.
//    * @deprecated since July 2015
//    * @see RFC 7578, Section 4.7
//    */
//   encoding: string;
//   /** Value of the `Content-Type` header for this file. */
//   mimetype: string;
//   /** Size of the file in bytes. */
//   size: number;
//   /**
//    * A readable stream of this file. Only available to the `_handleFile`
//    * callback for custom `StorageEngine`s.
//    */
//   stream: Readable;
//   /** `DiskStorage` only: Directory to which this file has been uploaded. */
//   destination: string;
//   /** `DiskStorage` only: Name of this file within `destination`. */
//   filename: string;
//   /** `DiskStorage` only: Full path to the uploaded file. */
//   path: string;
//   /** `MemoryStorage` only: A Buffer containing the entire file. */
//   buffer: Buffer;
// }

// type ErrorCode =
//         | "LIMIT_PART_COUNT"
//         | "LIMIT_FILE_SIZE"
//         | "LIMIT_FILE_COUNT"
//         | "LIMIT_FIELD_KEY"
//         | "LIMIT_FIELD_VALUE"
//         | "LIMIT_FIELD_COUNT"
//         | "LIMIT_UNEXPECTED_FILE";

//     class MulterError extends Error {
//         constructor(code: ErrorCode, field?: string);
//         /** Name of the MulterError constructor. */
//         name: string;
//         /** Identifying error code. */
//         code: ErrorCode;
//         /** Descriptive error message. */
//         message: string;
//         /** Name of the multipart form field associated with this error. */
//         field?: string | undefined;
//     }
