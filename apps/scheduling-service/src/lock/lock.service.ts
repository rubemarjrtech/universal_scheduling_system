import { Inject, Injectable } from '@nestjs/common';
import LOCK_PROVIDER_TOKEN from '../common/tokens/lock-provider.token';
import { RedisClientType } from 'redis';

@Injectable()
export class LockService {
  constructor(
    @Inject(LOCK_PROVIDER_TOKEN) private readonly client: RedisClientType,
  ) {}

  async get(key: string): Promise<string | {}> {
    return this.client.get(key);
  }
}
