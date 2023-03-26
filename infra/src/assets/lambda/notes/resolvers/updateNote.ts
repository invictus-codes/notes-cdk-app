// lambda-fns/updateNote.ts
import * as AWS from 'aws-sdk'
import type { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client'

interface Params {
  TableName: string
  Key: DocumentClient.Key
  ExpressionAttributeValues: any
  ExpressionAttributeNames: any
  UpdateExpression: string
  ReturnValues: string
}

const docClient = new AWS.DynamoDB.DocumentClient()

async function updateNote(note: any) {
  const params: Params = {
    TableName: process.env.NOTES_TABLE!,
    Key: {
      id: note.id,
    },
    ExpressionAttributeValues: {},
    ExpressionAttributeNames: {},
    UpdateExpression: '',
    ReturnValues: 'UPDATED_NEW',
  }
  let prefix = 'set '
  const attributes = Object.keys(note)
  for (let i = 0; i < attributes.length; i++) {
    const attribute = attributes[i]
    if (attribute !== 'id') {
      params.UpdateExpression
                += `${prefix}#${attribute} = :${attribute}`
      params.ExpressionAttributeValues[`:${attribute}`] = note[attribute]
      params.ExpressionAttributeNames[`#${attribute}`] = attribute
      prefix = ', '
    }
  }
  console.log('params: ', params)
  try {
    await docClient.update(params).promise()
    return note
  } catch (err) {
    console.log('DynamoDB error: ', err)
    return null
  }
}

export default updateNote
