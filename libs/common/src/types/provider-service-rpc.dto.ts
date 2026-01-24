import { ProviderAvailabilityDto, ProviderLockSlotDto } from '@app/common';
import { Observable } from 'rxjs';

export interface ProviderServiceRPC {
  getAvailability(data: ProviderAvailabilityDto): Observable<any>;
  lockSlot(data: ProviderLockSlotDto): Observable<any>;
}
