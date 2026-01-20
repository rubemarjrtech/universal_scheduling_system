import { Injectable } from '@nestjs/common';

@Injectable()
export class SchedulingService {
  findOne(data: { id: number }): boolean {
    console.log(data);
    return true;
  }
}
