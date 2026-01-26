import { status } from '@grpc/grpc-js';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter<
  T extends PrismaClientKnownRequestError,
> implements ExceptionFilter {
  catch(exception: T, _: ArgumentsHost) {
    switch (exception.code) {
      case 'P2002':
        throw new RpcException({
          code: status.ALREADY_EXISTS,
          message: `The value for the field '${exception.meta?.target}' already exists.`,
        });
      case 'P2025':
        throw new RpcException({
          code: status.NOT_FOUND,
          message:
            'Could not update or delete because the register does not exist.',
        });
      default:
        throw new RpcException({
          code: status.INTERNAL,
          message: exception.message,
        });
    }
  }
}
