import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import taskSchema, {
  TASKS_SCHEMA_NAME,
} from 'fluentsearch-types/dist/entity/task.entity';
import { QuotaModule } from 'src/quota/quota.module';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
const TaskInstance = MongooseModule.forFeature([
  { name: TASKS_SCHEMA_NAME, schema: taskSchema },
]);
@Module({
  imports: [TaskInstance, QuotaModule],
  providers: [TaskService, TaskResolver],
  exports: [TaskService, TaskInstance],
})
export class TaskModule {}
