import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigDatabaseService } from './config/config.database.service';
import { ConfigModule } from './config/config.module';
import { TaskModule } from './task/task.module';
import { WatchdogModule } from './watchdog/watchdog.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: ConfigDatabaseService,
    }),
    TaskModule,
    WatchdogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
