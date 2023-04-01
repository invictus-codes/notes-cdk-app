# aws-sdk-js-notes-app

Source [https://github.com/aws-samples/aws-sdk-js-notes-app](https://github.com/aws-samples/aws-sdk-js-notes-app)

In this app, you are going to build a simple note taking application using
[modular AWS SDK for JavaScript][modular-aws-sdk-js-blog-post]

The note taking application is the modified version from the original Open Source MIT licensed
project shared in the tutorials on [serverless-stack](http://serverless-stack.com).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [Create backend API](#create-backend-api)
  - [Deploy infrastructure](#deploy-infrastructure)
  - [Prepare frontend API](#prepare-frontend-api)
  - [Debug frontend](#debug-frontend)
  - [Clean up](#clean-up)

## Prerequisites

To set up this notes app, complete the following tasks:

- Install **Node.js** by following these steps:
  1. Install [nvm](https://github.com/nvm-sh/nvm#installation-and-update).
  1. Use node v18.x.x by running `nvm use` or `nvm use 18` in a terminal window.
  1. Verify that node is installed by running `node -v` in a terminal window and confirm that it shows Node.js >=18, such as `v18.13.0`).
  1. Enable corepack by running `corepack enable` in a terminal window.
- Install dependencies by running `pnpm`.
- If you don't have an AWS account, [create one](https://aws.amazon.com/premiumsupport/knowledge-center/create-and-activate-aws-account/).
  - If you're an Amazon employee, see the internal wiki for creating an AWS account.
- Install the [AWS CLI](https://aws.amazon.com/cli/).
  - Verify that the AWS CLI is installed by running `aws` in a terminal window.
- Set up [AWS Shared Credential File](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html).
  - Your `~/.aws/credentials` (`%UserProfile%\.aws\credentials` on Windows) should look like the following:
    ```
    [default]
    aws_access_key_id = <ACCESS_KEY>
    aws_secret_access_key = <SECRET_ACCESS_KEY>
    ```
  - Your `~/.aws/config` (`%UserProfile%\.aws\config` on Windows) should look like the following:
    ```
    [default]
    region = us-west-2
    ```

## Setup

This exercise code uses [modular AWS SDK for JavaScript][modular-aws-sdk-js] as follows:

- backend performs create, delete, get, list and update operations on DynamoDB.
- frontend does put, get, delete operations using an S3 browser client.

### Create backend API

- Run: `pnpm build:backend`
- This generates bundles to be deployed to lambda.

### Deploy infrastructure

- Run: `pnpm cdk deploy`
- This command:
  - Creates AWS infrastructure using [AWS Cloud Development Kit](https://aws.amazon.com/cdk/).
  - Deploys backend bundles to lambda.
  - Creates resources to be used in the frontend.

### Prepare frontend API

- Run: `pnpm prepare:frontend`
- This command copies AWS resources to the frontend config.

### Debug frontend

- Run: `pnpm start:frontend`
- This command starts ReactApp for testing frontend, and opens the URL in browser.

### Clean up

The Cloudformation stack can be deleted by running: `pnpm cdk destroy`

[modular-aws-sdk-js-blog-post]: https://aws.amazon.com/blogs/developer/modular-aws-sdk-for-javascript-is-now-generally-available/
[modular-aws-sdk-js]: https://github.com/aws/aws-sdk-js-v3/
