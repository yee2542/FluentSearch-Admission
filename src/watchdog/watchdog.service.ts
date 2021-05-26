import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import amqplib from 'amqplib';
import {
  FileTypeEnum,
  WORKER_INSIGHT_QUEUE,
  WORKER_VIDEO_INSIGHT_QUEUE,
} from 'fluentsearch-types';
import { ConfigService } from 'src/config/config.service';
import { QuotaService } from 'src/quota/quota.service';
import { TaskService } from 'src/task/task.service';

export const INTERVAL_WATCH_DOG = 1000;
@Injectable()
export class WatchdogService implements OnModuleInit {
  constructor(
    private readonly taskSerive: TaskService,
    private readonly quotaService: QuotaService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    Logger.log('Init watch dog', 'Watchdog');

    const config = this.configService.get().rabbitmq;
    const connectionString = `amqp://${config.username}:${config.password}@${config.endpoint}:5672`;
    const mq = await amqplib.connect(connectionString);
    const channel = await mq.createChannel();

    setInterval(async () => {
      const waitQueue = await this.taskSerive.getWaitQueue();
      for (const waitTask of waitQueue) {
        const owner = waitTask.owner;
        await this.quotaService.upsertQuota(owner);
        const penalty = !(await this.quotaService.deQuota(owner));
        if (penalty) {
          await this.taskSerive.setPenaltyTask(waitTask);
        } else {
          Logger.verbose('exec task : ' + waitTask._id, 'Watchdog');
          await this.taskSerive.setExcuteTask(waitTask);
          // send msq

          Logger.verbose('send task to ' + waitTask.fileType, 'Watchdog');
          waitTask.fileType === FileTypeEnum.Image &&
            channel.sendToQueue(
              WORKER_INSIGHT_QUEUE,
              Buffer.from(JSON.stringify(waitTask.toObject())),
            );

          waitTask.fileType === FileTypeEnum.Video &&
            channel.sendToQueue(
              WORKER_VIDEO_INSIGHT_QUEUE,
              Buffer.from(JSON.stringify(waitTask.toObject())),
            );
        }
      }
    }, INTERVAL_WATCH_DOG);
  }
}
