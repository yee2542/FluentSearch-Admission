import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import amqplib from 'amqplib';
import { ACK_TASK_QUEUE, ADMISSION_QUEUE, TaskDTO } from 'fluentsearch-types';
import { ConfigService } from './config/config.service';
import { QuotaService } from './quota/quota.service';
import { TaskService } from './task/task.service';
@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly taskService: TaskService,
    private readonly quotaService: QuotaService,
  ) {}

  async onModuleInit() {
    const config = this.configService.get().rabbitmq;
    const connectionString = `amqp://${config.username}:${config.password}@${config.endpoint}:5672`;
    const mq = await amqplib.connect(connectionString);
    const channel = await mq.createChannel();

    // get from storage service
    channel.consume(ADMISSION_QUEUE, async (msg) => {
      try {
        const payload = JSON.parse(msg?.content.toString() || '');
        Logger.verbose(payload, 'ADMISSION_QUEUE');
        await this.taskService.queueTask(payload);
      } catch (error) {
        Logger.error(error);
      }

      msg && channel.ack(msg);
    });

    // get ack from insight/video insight service
    channel.consume(ACK_TASK_QUEUE, async (msg) => {
      try {
        const payload = JSON.parse(msg?.content.toString() || '') as TaskDTO;
        await this.taskService.setAckTask(payload._id);
        await this.quotaService.upQuota(payload.owner);
        Logger.verbose(payload, 'ACK_QUEUE');
      } catch (error) {
        Logger.error(error);
      }
      msg && channel.ack(msg);
    });
  }
}
