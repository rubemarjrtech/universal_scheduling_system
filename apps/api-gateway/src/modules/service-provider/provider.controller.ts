import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Post,
  Query,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  PROVIDER_SERVICE,
  ProviderLockSlotDto,
  SCHEDULING_PACKAGE,
  type ProviderServiceRPC,
} from '@app/common';

@Controller('provider')
export class ProviderController implements OnModuleInit {
  private providerServiceRPC: ProviderServiceRPC;

  constructor(
    @Inject(SCHEDULING_PACKAGE) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.providerServiceRPC =
      this.client.getService<ProviderServiceRPC>(PROVIDER_SERVICE);
  }

  @Get('availability')
  async getAvailability(
    @Query('provider_id') provider_id: string,
    @Query('date') date: string,
    @Query('customer_id') customer_id: string,
  ) {
    return this.providerServiceRPC.getAvailability({
      provider_id: +provider_id,
      date,
      customer_id: +customer_id,
    });
  }

  @Post('lock-slot')
  async lockSlot(@Body() data: ProviderLockSlotDto) {
    return this.providerServiceRPC.lockSlot(data);
  }
}
