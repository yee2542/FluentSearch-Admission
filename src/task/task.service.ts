import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  MODEL_AVAILABLE_NAME,
  TaskDocument,
  TaskDTO,
  TaskStateEnum,
  TASKS_SCHEMA_NAME,
} from 'fluentsearch-types';
import { Model } from 'mongoose';
import { TaskStatus } from './dto/task-status.dto';

export const LIMIT_WATCH_DOG_TASK = 10;

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(TASKS_SCHEMA_NAME)
    private readonly taskMdel: Model<TaskDocument>,
  ) {}

  async queueTask(task: TaskDTO) {
    return this.taskMdel.create({ ...task, state: TaskStateEnum.wait });
  }

  async getWaitQueue() {
    return this.taskMdel
      .find({ state: TaskStateEnum.wait })
      .sort({ createAt: 1, priority: 1, updateAt: -1 })
      .limit(LIMIT_WATCH_DOG_TASK);
  }

  async setPenaltyTask(task: TaskDocument) {
    task.priority += 1;
    task.updateAt = new Date();
    return task.save();
  }

  async setExcuteTask(task: TaskDocument) {
    task.state = TaskStateEnum.excute;
    task.updateAt = new Date();
    return task.save();
  }

  async setAckTask(taskId: string) {
    const task = await this.taskMdel.findById(taskId);
    if (!task) throw Error('Task not existing');
    task.state = TaskStateEnum.finish;
    task.updateAt = new Date();
    return task.save();
  }

  async getUserTaskStatus(userId: string): Promise<TaskStatus> {
    const [wait, excute, finish] = await Promise.all([
      this.taskMdel
        .find({
          owner: userId,
          state: TaskStateEnum.wait,
        })
        .count(),
      this.taskMdel
        .find({
          owner: userId,
          state: TaskStateEnum.excute,
        })
        .count(),
      this.taskMdel
        .find({
          owner: userId,
          state: TaskStateEnum.finish,
        })
        .count(),
    ]);

    const recentTask: TaskStatus = {
      name: 'recent',
      wait,
      excute,
      finish,
      models: MODEL_AVAILABLE_NAME,
      createAt: new Date(),
    };

    return recentTask;
  }
}
