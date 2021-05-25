import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import amqplib from 'amqplib';
import { ConfigService } from './config/config.service';
import { ADMISSION_QUEUE } from 'fluentsearch-types';
import { TaskService } from './task/task.service';
@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    private readonly configService: ConfigService,
    private readonly taskService: TaskService,
  ) {}

  async onModuleInit() {
    const config = this.configService.get().rabbitmq;
    const connectionString = `amqp://${config.username}:${config.password}@${config.endpoint}:5672`;
    const mq = await amqplib.connect(connectionString);
    const channel = await mq.createChannel();

    channel.consume(ADMISSION_QUEUE, async (msg) => {
      const payload = JSON.parse(msg?.content.toString() || '');
      console.log(payload);
      try {
        await this.taskService.queueTask(payload);
      } catch (error) {
        Logger.error(error);
      }

      msg && channel.ack(msg);
    });
  }
}
