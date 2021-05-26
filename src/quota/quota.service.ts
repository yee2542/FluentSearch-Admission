import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuotaDocument, QUOTAS_SCHEMA_NAME } from 'fluentsearch-types';
import { Model } from 'mongoose';

export const DEFAULT_QUOTA = 20;
@Injectable()
export class QuotaService {
  constructor(
    @InjectModel(QUOTAS_SCHEMA_NAME)
    private readonly quotaModel: Model<QuotaDocument>,
  ) {}

  async upsertQuota(owner: string) {
    const quota = await this.quotaModel.findOne({ owner });
    if (quota) return quota;
    return this.quotaModel.create({ owner, available: DEFAULT_QUOTA });
  }

  async getUserQuota(owner: string) {
    return this.quotaModel.findOne({ owner });
  }

  async deQuota(owner: string) {
    const userQuota = await this.getUserQuota(owner);
    if (!userQuota) {
      Logger.error('User quota not exist');
      return false;
    }
    const valid = userQuota?.available > 0;
    if (!valid) return false;
    userQuota.available -= 1;
    await userQuota.save();
    return true;
  }

  async upQuota(owner: string) {
    const userQuota = await this.getUserQuota(owner);
    if (!userQuota) {
      Logger.error('User quota not exist');
      return;
    }
    userQuota.available += 1;
    await userQuota.save();
    return;
  }
}
