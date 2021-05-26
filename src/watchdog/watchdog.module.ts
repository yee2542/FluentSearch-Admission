import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { QuotaModule } from 'src/quota/quota.module';
import { TaskModule } from 'src/task/task.module';
import { WatchdogService } from './watchdog.service';

@Module({
  imports: [ConfigModule, TaskModule, QuotaModule],
  providers: [WatchdogService],
})
export class WatchdogModule {}
