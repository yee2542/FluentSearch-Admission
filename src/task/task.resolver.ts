import { Query, Resolver } from '@nestjs/graphql';
import { UserTasksDTO } from './dto/user-tasks.dto';

@Resolver()
export class TaskResolver {
  @Query(() => UserTasksDTO)
  async GetUserTasks(): Promise<UserTasksDTO> {
    return {} as any;
  }
}
