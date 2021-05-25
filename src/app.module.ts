import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigDatabaseService } from './config/config.database.service';
import { ConfigModule } from './config/config.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ConfigDatabaseService,
    }),
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
