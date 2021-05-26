import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QUOTAS_SCHEMA_NAME } from 'fluentsearch-types';
import quotaSchema from 'fluentsearch-types/dist/entity/quota.entity';
import { QuotaService } from './quota.service';
const QuotaInstance = MongooseModule.forFeature([
  { name: QUOTAS_SCHEMA_NAME, schema: quotaSchema },
]);
@Module({
  imports: [QuotaInstance],
  providers: [QuotaService],
  exports: [QuotaInstance, QuotaService],
})
export class QuotaModule {}
