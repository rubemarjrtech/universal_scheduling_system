import { Observable } from 'rxjs';
import { CreateSchedOptionsDto, SchedOptionsResponseDto } from '../dtos';

export interface ScheduleOptionsRpc {
  create(
    createScheduleOptionsDto: CreateSchedOptionsDto,
  ): Observable<SchedOptionsResponseDto>;
}
