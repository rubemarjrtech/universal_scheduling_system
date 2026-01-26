import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class GrpcToHttpInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (typeof err.code !== 'number') {
          return throwError(() => err);
        }

        const httpStatus = this.checkGrpStatus(err.code);
        return throwError(
          () =>
            new HttpException(
              err.details || err.message || 'gRPC Error',
              httpStatus,
            ),
        );
      }),
    );
  }

  private checkGrpStatus(code: number): number {
    switch (code) {
      case 3:
        return HttpStatus.BAD_REQUEST;
      case 5:
        return HttpStatus.NOT_FOUND;
      case 6:
        return HttpStatus.CONFLICT;
      case 7:
        return HttpStatus.FORBIDDEN;
      case 13:
        return HttpStatus.INTERNAL_SERVER_ERROR;
      case 14:
        return HttpStatus.SERVICE_UNAVAILABLE;
      case 16:
        return HttpStatus.UNAUTHORIZED;
      default:
        return HttpStatus.INTERNAL_SERVER_ERROR;
    }
  }
}
