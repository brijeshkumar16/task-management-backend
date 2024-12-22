import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { NestJsCustomLogger } from '../middleware/logger.middleware';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly loggerService: NestJsCustomLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    let errorMsg;
    try {
      errorMsg = exception;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      errorMsg = 'INTERNAL_SERVER_ERROR';
    }
    const errorString = (errorMsg as Error).toString();
    const requestType = host.getType<'rmq' | 'http'>();
    // Queue errors are handled separately, switchToHttp is not possible.
    if (requestType === 'rmq') {
    } else if (requestType === 'http') {
      this.forHttpHost(host, exception, errorString);
    }
  }

  private forHttpHost(
    host: ArgumentsHost,
    exception: unknown,
    errorString: string,
  ) {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const request = ctx.getRequest();
    this.loggerService.error(
      errorString,
      exception instanceof HttpException ? exception.name : 'unknownError',
    );

    httpAdapter.reply(
      ctx.getResponse(),
      {
        success: false,
        error: `${httpAdapter.getRequestUrl(request)}`,
        message:
          'An error occurred while processing your request. Please try again later.',
        data: {},
      },
      httpStatus,
    );
  }
}
