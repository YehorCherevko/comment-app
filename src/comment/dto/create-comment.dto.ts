import {
  IsString,
  IsEmail,
  IsOptional,
  IsUrl,
  Length,
  IsInt,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import * as sanitizeHtml from 'sanitize-html';

export class CreateCommentDto {
  @IsString()
  @Length(1, 50)
  userName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsUrl()
  homePage: string;

  @IsString()
  @Transform(({ value }) =>
    sanitizeHtml(value, { allowedTags: ['a', 'code', 'i', 'strong'] }),
  )
  text: string;

  @IsOptional()
  @IsInt()
  parentId?: number;

  @IsOptional()
  @ValidateIf((_, value) => value !== undefined)
  file?: Express.Multer.File;

  @IsString()
  captcha: string;
}
