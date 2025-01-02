import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { IsUUID, IsString, IsDateString } from 'class-validator';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

export class CreateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    example: 'Finish project report',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'A detailed description of the task',
    example: 'Prepare the financial report for Q4.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'The status of the task',
    example: TaskStatus.PENDING,
    enum: TaskStatus,
  })
  @IsNotEmpty()
  @IsEnum(TaskStatus, {
    message: 'Status must be pending, in-progress, or done.',
  })
  status: TaskStatus;

  @ApiPropertyOptional({
    description: 'The due date of the task (ISO 8601 format)',
    example: '2025-01-15T09:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'The ID of the category the task belongs to',
    example: 'b1234567-89ab-cdef-0123-456789abcdef',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'An array of tag IDs associated with the task',
    example: [
      'c1234567-89ab-cdef-0123-456789abcdef',
      'd1234567-89ab-cdef-0123-456789abcdef',
    ],
    type: [String],
  })
  @IsOptional()
  @IsUUID('4', { each: true })
  tagIds?: string[];
}
