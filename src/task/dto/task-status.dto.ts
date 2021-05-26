import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { ModelEnum, TaskStateEnum } from 'fluentsearch-types';

registerEnumType(TaskStateEnum, { name: 'TaskStateEnum' });
registerEnumType(ModelEnum, { name: 'ModelEnum' });

@ObjectType()
export class TaskStatus {
  @Field()
  name: string;

  @Field(() => Number)
  wait: number;

  @Field(() => Number)
  excute: number;

  @Field(() => Number)
  finish: number;

  @Field(() => [ModelEnum])
  models: ModelEnum[];

  @Field(() => String)
  createAt: Date;
}
