import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaskDocument, TaskDTO, TASKS_SCHEMA_NAME } from 'fluentsearch-types';
import { Model } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(TASKS_SCHEMA_NAME)
    private readonly taskMdel: Model<TaskDocument>,
  ) {}

  async createTask(task: TaskDTO) {
    return this.taskMdel.create(task);
  }
}
