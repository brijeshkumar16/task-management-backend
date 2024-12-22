import { LoggerService, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NestJsCustomLogger implements LoggerService {
  readonly logger: Logger;
  constructor() {
    this.logger = new Logger();
  }

  log(message: any, context?: string) {
    this.logger.log(message, context);
  }

  error(message: any, context?: string) {
    this.logger.error(message, context);
  }

  warn(message: any, context?: string) {
    this.logger.warn(message, context);
  }

  debug(message: any, context?: string) {
    this.logger.debug(message, context);
  }

  verbose(message: any, context?: string) {
    this.logger.verbose(message, context);
  }
}
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly customLogger: NestJsCustomLogger) {}
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, body } = req;
    res.on('close', () => {
      const { statusCode } = res;
      this.customLogger.log(
        `${method} ${originalUrl} ${statusCode} ${JSON.stringify(body)}`,
        LoggerMiddleware.name,
      );
    });
    next();
  }
}
