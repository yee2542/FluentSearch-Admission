import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [ConfigModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
