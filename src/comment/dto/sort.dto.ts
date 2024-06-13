import { IsString, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class SortDto {
  @IsString()
  @IsIn(['userName', 'email', 'createdAt'])
  sortBy: string;

  @IsString()
  @Transform(({ value }) => value.toUpperCase())
  @IsIn(['ASC', 'DESC'])
  sortOrder: string;
}
