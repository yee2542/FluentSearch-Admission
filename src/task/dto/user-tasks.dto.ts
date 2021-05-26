import { Field, ObjectType } from '@nestjs/graphql';
import { TaskStatus } from './task-status.dto';

@ObjectType()
export class UserTasksDTO {
  @Field(() => [TaskStatus])
  tasks: TaskStatus[];

  @Field(() => Number)
  quota: number;
}
