import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { AllExceptionsFilter } from './common/filter/all.exception.filter';
import { NestJsCustomLogger } from './common/middleware/logger.middleware';
import { PrismaModule } from './provider/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [],
  providers: [
    NestJsCustomLogger,
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
