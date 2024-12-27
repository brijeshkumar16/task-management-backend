import { ApiProperty } from '@nestjs/swagger';

export class RefreshAuthDto {
  @ApiProperty()
  refreshToken: string;
}
