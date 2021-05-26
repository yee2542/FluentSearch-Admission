import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { TaskStateEnum } from 'fluentsearch-types';

registerEnumType(TaskStateEnum, { name: 'TaskStateEnum' });

@ObjectType()
export class TaskStatus {
  @Field()
  name: string;

  @Field(() => TaskStateEnum)
  type: TaskStateEnum;

  @Field(() => Number)
  n: number;
}
