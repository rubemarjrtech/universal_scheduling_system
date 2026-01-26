import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProviderService } from './provider.service';
import {
  PROVIDER_SERVICE,
  ProviderAvailabilityDto,
  ProviderLockSlotDto,
} from '@app/common';

@Controller()
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @GrpcMethod(PROVIDER_SERVICE, 'getAvailability')
  async getAvailability(data: ProviderAvailabilityDto) {
    const availability = await this.providerService.getAvailability(data);

    return { availability: availability || [] };
  }

  @GrpcMethod(PROVIDER_SERVICE, 'lockSlot')
  async lockSlot(data: ProviderLockSlotDto) {
    return this.providerService.lockSlot(data);
  }
}
