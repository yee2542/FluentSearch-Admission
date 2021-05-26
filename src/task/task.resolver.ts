import { Args, Query, Resolver } from '@nestjs/graphql';
import { QuotaService } from 'src/quota/quota.service';
import { UserTasksDTO } from './dto/user-tasks.dto';
import { TaskService } from './task.service';

@Resolver()
export class TaskResolver {
  constructor(
    private readonly quotaService: QuotaService,
    private readonly taskService: TaskService,
  ) {}

  @Query(() => UserTasksDTO)
  async GetUserTasks(@Args('userId') userId: string): Promise<UserTasksDTO> {
    const quota = (await this.quotaService.getUserQuota(userId))?.available;
    const taskStatus = await this.taskService.getUserTaskStatus(userId);
    return {
      tasks: taskStatus,
      quota: quota || -1,
    };
  }
}
