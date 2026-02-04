import { Observable } from 'rxjs';
import {
  CreateAppointmentDto,
  FindCustomerAppointmentDto,
  FindProviderAppointmentDto,
  AppointmentResponseDto,
} from '../dtos';
import { ListWrapper } from './list-wrapper';

export interface AppointmentServiceRPC {
  create(data: CreateAppointmentDto): Observable<AppointmentResponseDto>;
  findManyByProvider(
    data: FindProviderAppointmentDto,
  ): Observable<ListWrapper<AppointmentResponseDto>>;
  findManyByCustomer(
    data: FindCustomerAppointmentDto,
  ): Observable<ListWrapper<AppointmentResponseDto>>;
  findOne(data: { id: number }): Observable<any>;
}
