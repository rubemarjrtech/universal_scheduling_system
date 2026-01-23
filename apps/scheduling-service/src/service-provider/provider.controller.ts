import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProviderService } from './provider.service';
import { ProviderAvailabilityDto } from '@app/common';

@Controller()
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @GrpcMethod('ProviderService', 'getAvailability')
  async getAvailability(data: ProviderAvailabilityDto) {
    const availability = await this.providerService.getAvailability(data);

    return { availability: availability || [] };
  }
}
