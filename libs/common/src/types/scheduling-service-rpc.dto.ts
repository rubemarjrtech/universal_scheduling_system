import { Observable } from 'rxjs';

export interface SchedulingServiceRPC {
  findOne(data: { id: number }): Observable<any>;
}
