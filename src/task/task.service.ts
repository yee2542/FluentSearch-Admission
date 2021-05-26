import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  QUOTAS_SCHEMA_NAME,
  TaskDocument,
  TaskDTO,
  TaskStateEnum,
  TASKS_SCHEMA_NAME,
} from 'fluentsearch-types';
import { Model } from 'mongoose';

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

  // async getReadyToSendInsight() {
  //   return this.taskMdel.aggregate([
  //     {
  //       $match: {
  //         type: TaskStateEnum.wait,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: QUOTAS_SCHEMA_NAME,
  //         localField: 'owner',
  //         foreignField: 'owner',
  //         as: 'quota',
  //       },
  //     },
  //     {
  //       $match: {
  //         available: {
  //           $gte: 0,
  //         },
  //       },
  //     },
  //     {
  //       $sort: {
  //         updateAt: -1,
  //       },
  //     },
  //     { $limit: LIMIT_WATCH_DOG_TASK },
  //   ]);
  //   // .allowDiskUse(true);
  // }
}
