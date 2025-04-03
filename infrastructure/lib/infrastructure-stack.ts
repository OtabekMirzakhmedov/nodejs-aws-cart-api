import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNode from 'aws-cdk-lib/aws-lambda-nodejs';
import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as path from 'path';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dbHost = process.env.DB_HOST as string;
    const dbPort = process.env.DB_PORT as string;
    const dbUsername = process.env.DB_USERNAME as string;
    const dbPassword = process.env.DB_PASSWORD as string;
    const dbDatabase = process.env.DB_DATABASE as string;

    const cartServiceLambda = new lambdaNode.NodejsFunction(
      this,
      'CartServiceLambda',
      {
        functionName: 'cart-service-lambda',
        entry: path.join(__dirname, '../../src/lambda.ts'),
        memorySize: 1024,
        timeout: cdk.Duration.seconds(30),
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'handler',
        environment: {
          DB_HOST: dbHost,
          DB_PORT: dbPort,
          DB_USERNAME: dbUsername,
          DB_PASSWORD: dbPassword,
          DB_DATABASE: dbDatabase,
          NODE_ENV: 'production',
        },
        bundling: {
          minify: false,
          sourceMap: true,
          target: 'node20',
          externalModules: [
            '@nestjs/websockets',
            '@nestjs/websockets/socket-module',
            '@nestjs/microservices/microservices-module',
            '@nestjs/microservices',
            'class-transformer',
            'class-validator',
          ],
          forceDockerBundling: false,
        },
        depsLockFilePath: path.join(__dirname, '../../package-lock.json'),
      },
    );

    const lambdaIntegration = new HttpLambdaIntegration(
      'CartLambdaIntegration',
      cartServiceLambda,
    );
    const httpApi = new HttpApi(this, 'CartHttpApi', {
      apiName: 'Cart Service API',
      description: 'HTTP API for Cart Service',
    });

    httpApi.addRoutes({
      path: '/{proxy+}',
      methods: [HttpMethod.ANY],
      integration: lambdaIntegration,
    });

    httpApi.addRoutes({
      path: '/',
      methods: [HttpMethod.ANY],
      integration: lambdaIntegration,
    });

    new cdk.CfnOutput(this, 'ApiUrl', {
      value: httpApi.url || '',
      description: 'URL of the Cart Service API',
    });
  }
}
