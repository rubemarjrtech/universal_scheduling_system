import { Controller } from '@nestjs/common';
import { LockGateway } from './lock.gateway';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class EventsController {
  constructor(private readonly lockGateway: LockGateway) {}

  @EventPattern('slot_booked')
  handleBooked(@Payload() data: any) {
    this.lockGateway.notifySlotBooked(data);
  }

  @EventPattern('slot_locked')
  async handleLockedSlot(@Payload() data: any) {
    this.lockGateway.notifySlotLock(data);
  }
}
