import { PaginationDto } from 'src/common/dto/pagination.dto';

export class ListTasksDto extends PaginationDto {
  title!: string;
}
