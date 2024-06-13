import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  Session,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationDto } from './dto/pagination.dto';
import { SortDto } from './dto/sort.dto';
import * as multer from 'multer';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 1024 * 1024 }, // 1MB file size limit
    }),
  )
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @UploadedFile() file: Express.Multer.File,
    @Session() session: Record<string, any>,
  ) {
    if (createCommentDto.captcha !== session.captcha) {
      throw new BadRequestException('Invalid CAPTCHA');
    }
    return this.commentService.create(createCommentDto, file);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto, @Query() sortDto: SortDto) {
    return this.commentService.findAll(paginationDto, sortDto);
  }

  @Get('count')
  countTopLevelComments() {
    return this.commentService.countTopLevelComments();
  }
}
