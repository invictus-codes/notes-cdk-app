import {Construct} from 'constructs';
import * as CDK from "aws-cdk-lib";
import {RemovalPolicy} from "aws-cdk-lib";
import * as AppSync from "aws-cdk-lib/aws-appsync";
import * as dynamoDB from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as Cognito from "aws-cdk-lib/aws-cognito";
import {NotesStackProps} from "../bin/notes-cdk-app";

const root = process.cwd()

export class NotesCdkAppStack extends CDK.Stack {
    constructor(scope: Construct, id: string, props: NotesStackProps) {
        super(scope, id, props);

        const userPool = new Cognito.UserPool(this, `${props.appName}UserPool`, {
            removalPolicy: RemovalPolicy.DESTROY,
            selfSignUpEnabled: true,
            accountRecovery: Cognito.AccountRecovery.EMAIL_ONLY,
            userVerification: {
                emailStyle: Cognito.VerificationEmailStyle.CODE,
            },
            autoVerify: {
                email: true,
            },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: true,
                },
            },
        });

        const userPoolClient = new Cognito.UserPoolClient(this, `${props.appName}UserPoolClient`, {
            userPool,
        });

        new CDK.CfnOutput(this, "UserPoolId", {
            value: userPool.userPoolId,
        });

        new CDK.CfnOutput(this, "UserPoolClientId", {
            value: userPoolClient.userPoolClientId,
        });

        const api = new AppSync.GraphqlApi(this, `${props.appName}AppSync`, {
            name: `${props.appName}-appsync-api`,
            schema: AppSync.SchemaFile.fromAsset(`${root}/src/graphql/schema.graphql`),
            authorizationConfig: {
                defaultAuthorization: {
                    authorizationType: AppSync.AuthorizationType.API_KEY,
                    apiKeyConfig: {

                        expires: CDK.Expiration.after(CDK.Duration.days(7)),
                    },
                },
                additionalAuthorizationModes: [
                    {
                        authorizationType: AppSync.AuthorizationType.USER_POOL,
                        userPoolConfig: {
                            userPool,
                        },
                    },
                ],
            },
            xrayEnabled: true,
        });

        const lambdaNotesHandler = new lambda.Function(this, `${props.appName}AppSyncNotesHandler`, {
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: "main.handler",
            code: lambda.Code.fromAsset(`${root}/src/assets/lambda/notes`),
            memorySize: 1024,
        });

        const lambdaDataSource = api.addLambdaDataSource(`${props.appName}LambdaDatasource`, lambdaNotesHandler);

        const getNoteByIdResolver = "getNoteById"
        lambdaDataSource.createResolver(`${props.appName}.${getNoteByIdResolver}`, {
            typeName: "Query",
            fieldName: getNoteByIdResolver
        });

        const listNotesResolver = "listNotes"
        lambdaDataSource.createResolver(`${props.appName}.${listNotesResolver}`, {
            typeName: "Query",
            fieldName: listNotesResolver
        });

        const createNoteResolver = "createNote"
        lambdaDataSource.createResolver(`${props.appName}.${createNoteResolver}`, {
            typeName: "Mutation",
            fieldName: createNoteResolver
        });

        const updateNoteResolver = "updateNote"
        lambdaDataSource.createResolver(`${props.appName}.${updateNoteResolver}`, {
            typeName: "Mutation",
            fieldName: updateNoteResolver
        });

        const deleteNoteResolver = "deleteNote"
        lambdaDataSource.createResolver(`${props.appName}.${deleteNoteResolver}`, {
            typeName: "Mutation",
            fieldName: deleteNoteResolver
        });

        const dynamoNotesTable = new dynamoDB.Table(this, `${props.appName}DynamodbTable`, {
            billingMode: dynamoDB.BillingMode.PAY_PER_REQUEST,
            removalPolicy: RemovalPolicy.DESTROY,
            partitionKey: {
                name: "id",
                type: dynamoDB.AttributeType.STRING,
            },
        });

        dynamoNotesTable.grantFullAccess(lambdaNotesHandler);

        lambdaNotesHandler.addEnvironment("NOTES_TABLE", dynamoNotesTable.tableName);

        new CDK.CfnOutput(this, "GraphQLAPIURL", {
            value: api.graphqlUrl,
        });

        // Prints out the AppSync GraphQL API key to the terminal
        new CDK.CfnOutput(this, "GraphQLAPIKey", {
            value: api.apiKey || "",
        });

        // Prints out the stack region to the terminal
        new CDK.CfnOutput(this, "Stack Region", {
            value: this.region,
        });
    }
}
