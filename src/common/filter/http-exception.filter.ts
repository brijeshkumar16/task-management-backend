import { ArgumentsHost, HttpException } from '@nestjs/common';
import { ExceptionFilter, Catch } from '@nestjs/common';
import { Request, Response } from 'express';

import { NestJsCustomLogger } from '../middleware/logger.middleware';
import { isObject } from '@nestjs/common/utils/shared.utils';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: NestJsCustomLogger) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    this.loggerService.error(
      {
        ...exception,
        path: request.url,
      },
      exception.name,
    );

    const res = exception.getResponse() as
      | string
      | {
          success?: boolean;
          message: string | string[];
          error?: string;
          data?: object;
        };

    let msg;
    let error = '';
    let success = false;
    let data = {};

    if (isObject(res)) {
      msg = Array.isArray(res.message) ? res.message.pop() : res.message;
      error = typeof res.error === 'string' ? res.error : '';
      data = res.data ?? {};
      success = res.success ?? false;
    } else {
      msg = res;
    }

    response.status(status).json({
      success: success,
      error: error,
      message: msg,
      data: data,
    });
  }
}
