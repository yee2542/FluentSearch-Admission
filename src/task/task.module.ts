import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import taskSchema, {
  TASKS_SCHEMA_NAME,
} from 'fluentsearch-types/dist/entity/task.entity';
import { TaskService } from './task.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TASKS_SCHEMA_NAME, schema: taskSchema },
    ]),
  ],
  providers: [TaskService],
})
export class TaskModule {}
