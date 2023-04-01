import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { FILES_BUCKET } from '../config.json'
import { s3Client } from './s3Client'

const deleteObject = async (fileName: string) =>
  s3Client.send(
    new DeleteObjectCommand({
      Key: fileName,
      Bucket: FILES_BUCKET,
    })
  )

export { deleteObject }
