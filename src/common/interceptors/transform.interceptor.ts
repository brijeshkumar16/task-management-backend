import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Injectable, NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { IGNORE_TRANSFORM_INTERCEPTOR } from '../decorators/ignore-transform-interceptor.decorator';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // ): Observable<CommonResponse | InternalResponse> {
    // if (isRabbitContext(context)) {
    //   return next.handle();
    // }

    const ignore = this.reflector.getAllAndOverride<boolean>(
      IGNORE_TRANSFORM_INTERCEPTOR,
      [context.getHandler(), context.getClass()],
    );
    if (ignore) {
      return next.handle().pipe(
        map((data) => {
          return data;
        }),
      );
    }

    return next.handle().pipe(
      map((data) => {
        return {
          success: true,
          error: '',
          data: data ?? {},
          message: '',
        };
      }),
    );
  }
}
