import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take: number | undefined | null;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page: number | undefined | null;

  get getTake() {
    return !this.take || this.take <= 0 ? 10 : this.take;
  }

  get getPage() {
    return !this.page || this.page <= 0 ? 1 : this.page;
  }

  get getSkip() {
    return (this.getPage - 1) * this.getTake;
  }

  toPrismaPaging() {
    return {
      skip: this.getSkip,
      take: this.getTake,
    };
  }

  createResponse<T>(list: Array<T>, count?: number) {
    return {
      list,
      paging: {
        totalRow: count,
        currentPage: this.getPage,
        take: this.getTake,
      },
    };
  }
}
