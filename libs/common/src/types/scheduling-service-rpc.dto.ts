import { Observable } from 'rxjs';
import { CreateAppointmentDto, DefaultAppoResponseDto } from '../dtos';

export interface SchedulingServiceRPC {
  create(data: CreateAppointmentDto): DefaultAppoResponseDto;
  findOne(data: { id: number }): Observable<any>;
}
