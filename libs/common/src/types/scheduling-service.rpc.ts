import { Observable } from 'rxjs';
import {
  CreateAppointmentDto,
  FindCustomerSchedulingDto,
  FindProviderSchedulingDto,
  SchedulingResponseDto,
} from '../dtos';
import { ListWrapper } from './list-wrapper';

export interface SchedulingServiceRPC {
  create(data: CreateAppointmentDto): Observable<SchedulingResponseDto>;
  findManyByProvider(
    data: FindProviderSchedulingDto,
  ): Observable<ListWrapper<SchedulingResponseDto>>;
  findManyByCustomer(
    data: FindCustomerSchedulingDto,
  ): Observable<ListWrapper<SchedulingResponseDto>>;
  findOne(data: { id: number }): Observable<any>;
}
