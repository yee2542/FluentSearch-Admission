import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FileTypeEnum,
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

  async getUserTaskStatus(userId: string): Promise<TaskStatus[]> {
    const [waitImage, excuteImage, finishImage] = await Promise.all([
      this.taskMdel
        .find({
          owner: userId,
          state: TaskStateEnum.wait,
          fileType: FileTypeEnum.Image,
        })
        .count(),
      this.taskMdel
        .find({
          owner: userId,
          state: TaskStateEnum.excute,
          fileType: FileTypeEnum.Image,
        })
        .count(),
      this.taskMdel
        .find({
          owner: userId,
          state: TaskStateEnum.finish,
          fileType: FileTypeEnum.Image,
        })
        .count(),
    ]);
    const [waitVideo, excuteVideo, finishVideo] = await Promise.all([
      this.taskMdel
        .find({
          owner: userId,
          state: TaskStateEnum.wait,
          fileType: FileTypeEnum.Video,
        })
        .count(),
      this.taskMdel
        .find({
          owner: userId,
          state: TaskStateEnum.excute,
          fileType: FileTypeEnum.Video,
        })
        .count(),
      this.taskMdel
        .find({
          owner: userId,
          state: TaskStateEnum.finish,
          fileType: FileTypeEnum.Video,
        })
        .count(),
    ]);

    const recentTask: TaskStatus[] = [
      {
        name: 'recent-image',
        wait: waitImage,
        excute: excuteImage,
        finish: finishImage,
        models: MODEL_AVAILABLE_NAME,
        createAt: new Date(),
      },
      {
        name: 'recent-video',
        wait: waitVideo,
        excute: excuteVideo,
        finish: finishVideo,
        models: MODEL_AVAILABLE_NAME,
        createAt: new Date(),
      },
    ];

    return recentTask;
  }
}
