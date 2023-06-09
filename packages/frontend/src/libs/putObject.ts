import { PutObjectCommand } from '@aws-sdk/client-s3'
import { FILES_BUCKET } from '../config.json'
import { s3Client } from './s3Client'

const putObject = async (file: File) => {
  const Key = `${Date.now()}-${file.name}`
  await s3Client.send(
    new PutObjectCommand({
      Key,
      Body: file,
      Bucket: FILES_BUCKET,
    })
  )
  return Key
}

export { putObject }
