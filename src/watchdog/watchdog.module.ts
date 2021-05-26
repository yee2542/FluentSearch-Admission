import { Module } from '@nestjs/common';
import { QuotaModule } from 'src/quota/quota.module';
import { TaskModule } from 'src/task/task.module';
import { WatchdogService } from './watchdog.service';

@Module({
  imports: [TaskModule, QuotaModule],
  providers: [WatchdogService],
})
export class WatchdogModule {}
