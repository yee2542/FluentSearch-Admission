import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TaskOverviewDTO {
  @Field(() => Number)
  wait: number;

  @Field(() => Number)
  excute: number;

  @Field(() => Number)
  finish: number;

  @Field(() => Number)
  quota: number;
}
