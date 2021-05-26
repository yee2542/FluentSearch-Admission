import { Field, ObjectType } from '@nestjs/graphql';
import { TaskOverviewDTO } from './task-overview.dto';
import { TaskStatus } from './task-status.dto';

@ObjectType()
export class UserTasksDTO {
  @Field(() => [TaskStatus])
  tasks: TaskStatus[];

  @Field(() => TaskOverviewDTO)
  overview: TaskOverviewDTO;
}
