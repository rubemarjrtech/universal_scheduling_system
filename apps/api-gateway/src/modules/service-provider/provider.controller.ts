import { Controller, Get, Inject, OnModuleInit, Query } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { SCHEDULING_PACKAGE, type ProviderServiceRPC } from '@app/common';

@Controller('provider')
export class ProviderController implements OnModuleInit {
  private providerServiceRPC: ProviderServiceRPC;

  constructor(
    @Inject(SCHEDULING_PACKAGE) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.providerServiceRPC =
      this.client.getService<ProviderServiceRPC>('ProviderService');
  }

  @Get('availability')
  async getAvailability(
    @Query('provider_id') provider_id: string,
    @Query('date') date: string,
  ) {
    return this.providerServiceRPC.getAvailability({
      provider_id: +provider_id,
      date,
    });
  }
}
