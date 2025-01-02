import { ValidationException } from '../exceptions/validation.exception';
import {
  Injectable,
  ValidationPipe as ValidationPipeBuiltin,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe extends ValidationPipeBuiltin {
  constructor() {
    super({
      transform: true,
      exceptionFactory: (errors) => new ValidationException(errors),
    });
  }
}
