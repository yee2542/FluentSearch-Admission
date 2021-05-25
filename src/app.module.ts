import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { EXCHANGE_INSIGHT, EXCHANGE_VIDEO_INSIGHT } from 'fluentsearch-types';

const RabbitInstance = RabbitMQModule.forRootAsync(RabbitMQModule, {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configSerivce: ConfigService) => {
    const config = configSerivce.get().rabbitmq;
    return {
      uri: `amqp://${config.username}:${config.password}@${config.endpoint}:5672`,

      exchanges: [
        { name: EXCHANGE_INSIGHT, type: 'direct' },
        { name: EXCHANGE_VIDEO_INSIGHT, type: 'direct' },
      ],
    };
  },
});

@Module({
  imports: [ConfigModule, RabbitInstance],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
