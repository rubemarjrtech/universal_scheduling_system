import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { Prisma } from '@prisma/client';
import { status } from '@grpc/grpc-js';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    _: ArgumentsHost,
  ): Observable<any> {
    const errorCode = exception.code;
    return throwError(() => {
      switch (errorCode) {
        case 'P2002':
          return {
            code: status.ALREADY_EXISTS,
            message: `Conflict: Value for the field '${exception.meta?.target}' already exists.`,
          };

        case 'P2025':
          return {
            code: status.NOT_FOUND,
            message: 'Record not found.',
          };

        default:
          return {
            code: status.INTERNAL,
            message: 'Internal Server Error.',
          };
      }
    });
  }
}
