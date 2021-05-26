import { Module } from '@nestjs/common';
import { QuotaService } from './quota.service';

@Module({
  providers: [QuotaService],
})
export class QuotaModule {}
