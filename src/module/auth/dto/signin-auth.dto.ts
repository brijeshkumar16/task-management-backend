import { ApiProperty } from '@nestjs/swagger';

export class SignInAuthDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
