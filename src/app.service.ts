import { Injectable, OnModuleInit } from '@nestjs/common';
import amqplib from 'amqplib';
import { ConfigService } from './config/config.service';
import { ADMISSION_QUEUE } from 'fluentsearch-types';
@Injectable()
export class AppService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const config = this.configService.get().rabbitmq;
    const connectionString = `amqp://${config.username}:${config.password}@${config.endpoint}:5672`;
    const mq = await amqplib.connect(connectionString);
    const channel = await mq.createChannel();

    channel.consume(ADMISSION_QUEUE, (msg) => {
      const payload = JSON.parse(msg?.content.toString() || '');
      console.log(payload);

      // FIXME: ack needed
      // msg && channel.ack(msg);
    });
  }
}
