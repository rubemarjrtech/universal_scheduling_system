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

  async set(key: string, customer_id: number): Promise<boolean> {
    const result = await this.client.set(key, `${customer_id}`, {
      condition: 'NX',
      expiration: { type: 'EX', value: 60 },
    });
    return result === 'OK';
  }

  async release(key: string, owner_id: string): Promise<boolean> {
    // Script Lua: If the key value equals the ownerId, delete. If not, do nothing.
    const luaScript = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;

    const result = await this.client.eval(luaScript, {
      keys: [key],
      arguments: [owner_id],
    });

    return result === 1;
  }
}
