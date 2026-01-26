import { Module } from '@nestjs/common';
import { LockGateway } from './lock.gateway';

@Module({
  providers: [LockGateway],
  exports: [LockGateway],
})
export class SocketModule {}
