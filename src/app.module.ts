import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigDatabaseService } from './config/config.database.service';
import { ConfigModule } from './config/config.module';
import { TaskModule } from './task/task.module';
import { WatchdogModule } from './watchdog/watchdog.module';
import { QuotaModule } from './quota/quota.module';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ConfigDatabaseService,
    }),
    TaskModule,
    WatchdogModule,
    QuotaModule,
    GraphQLFederationModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          path: '/graphql',
          introspection: true,
          playground: {
            settings: {
              'request.credentials': 'include',
            },
          },
          cors: {
            origin: configService.get().origin,
            credentials: true,
          },
          installSubscriptionHandlers: false,
          autoSchemaFile: 'schema.gql',
          sortSchema: true,
          context: ({ req, res, payload, connection }) => ({
            req,
            res,
            payload,
            connection,
          }),
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
