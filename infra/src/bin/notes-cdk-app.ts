#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import type { StackProps } from 'aws-cdk-lib'
import { NotesCdkAppStack } from '../lib/notes-cdk-app-stack'

export interface NotesStackProps extends StackProps {
  appName: string
}

const notesStackProps: NotesStackProps = {
  appName: 'CdkNotes',
}

const account = '362662889146'
const region = 'eu-west-1'

const app = new cdk.App()
new NotesCdkAppStack(app, `${notesStackProps.appName}Stack`, {
  ...notesStackProps,
  env: { account, region },
})
