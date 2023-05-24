import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { Request } from 'express';
import { AppController } from './app.controller';
import { TcpAuthController } from './modules/tcp/auth/tcp-auth.controller';
import { TcpAuthService } from './modules/tcp/auth/tcp-auth.service';
import { Securities, SecuritiesSchema } from './schemas';
import configuration from './config/configuration';
import { CORRELATION_ID_HEADER, CorrelationIdMiddleware } from './correlation-id/correlation-id.middleware';


@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true
          },
        },
        customProps: (req: Request) => {
          return {
            correlationId: req[CORRELATION_ID_HEADER]
          }
        },
        autoLogging: false,
        serializers: {
          req: () => {
            return undefined;
          },
          res: () => {
            return undefined;
          }
        }
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('mongodb'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: Securities.name,
        schema: SecuritiesSchema,
      }
    ]),
  ],
  controllers: [AppController, TcpAuthController],
  providers: [TcpAuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(CorrelationIdMiddleware).forRoutes('*')
  }
}
