import { IsInt, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(1)
  limit: number;
}
