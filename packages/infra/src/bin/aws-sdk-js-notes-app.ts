import { App } from 'aws-cdk-lib'
import { AwsSdkJsNotesAppStack } from '../lib/aws-sdk-js-notes-app-stack'

const account = '362662889146'
const region = 'eu-west-1'

const app = new App()
new AwsSdkJsNotesAppStack(app, 'aws-sdk-js-notes-app', {
  env: {
    account,
    region
  },
})
