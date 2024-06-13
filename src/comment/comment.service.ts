import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { PaginationDto } from './dto/pagination.dto';
import { SortDto } from './dto/sort.dto';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class CommentService {
  private uploadDir: string;

  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private eventEmitter: EventEmitter2,
  ) {
    this.uploadDir =
      this.configService.get<string>('UPLOAD_DIR') || './uploads';
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async create(
    createCommentDto: CreateCommentDto,
    file?: Express.Multer.File,
  ): Promise<Comment> {
    const { parentId, ...rest } = createCommentDto;
    const comment = this.commentRepository.create(rest);

    if (parentId) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: parentId },
      });
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
      comment.parent = parentComment;
    }

    if (file) {
      await this.processFile(file, comment);
    }

    await this.cacheManager.reset(); // Clear cache on new comment creation
    const savedComment = await this.commentRepository.save(comment);
    this.eventEmitter.emit('comment.created', savedComment); // Emit event
    return savedComment;
  }

  private async processFile(file: Express.Multer.File, comment: Comment) {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type');
    }

    if (file.mimetype.startsWith('image/')) {
      await this.processImage(file, comment);
    } else if (file.mimetype === 'text/plain') {
      await this.processTextFile(file, comment);
    }
  }

  private async processImage(file: Express.Multer.File, comment: Comment) {
    const fileName = `${Date.now()}-${file.originalname}`;
    const outputPath = path.join(this.uploadDir, fileName);

    const resizedImage = await sharp(file.buffer)
      .resize(320, 240, { fit: 'inside' })
      .toBuffer();

    fs.writeFileSync(outputPath, resizedImage);
    comment.filePath = path.relative(process.cwd(), outputPath); // Store the relative path
  }

  private async processTextFile(file: Express.Multer.File, comment: Comment) {
    if (file.size > 1024 * 100) {
      // 100KB limit
      throw new BadRequestException('File is too large');
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const outputPath = path.join(this.uploadDir, fileName);
    fs.writeFileSync(outputPath, file.buffer);
    comment.filePath = path.relative(process.cwd(), outputPath); // Store the relative path
  }

  async findAll(
    paginationDto: PaginationDto,
    sortDto: SortDto,
  ): Promise<Comment[]> {
    const cacheKey = `comments_${paginationDto.page}_${paginationDto.limit}_${sortDto.sortBy}_${sortDto.sortOrder}`;
    let results: Comment[] = await this.cacheManager.get<Comment[]>(cacheKey);

    if (!results) {
      const { page, limit } = paginationDto;
      const { sortBy, sortOrder } = sortDto;

      results = await this.commentRepository.find({
        where: { parent: null }, // Only top-level comments
        order: { [sortBy]: sortOrder || 'DESC' }, // Default sorting by createdAt in descending order (LIFO)
        skip: (page - 1) * limit,
        take: limit,
        relations: ['replies'],
      });

      await this.cacheManager.set(cacheKey, results, 60); // Cache results for 60 seconds
    }

    return results;
  }

  async countTopLevelComments(): Promise<number> {
    const cacheKey = 'countTopLevelComments';
    let count: number = await this.cacheManager.get<number>(cacheKey);

    if (count === undefined) {
      count = await this.commentRepository.count({ where: { parent: null } });
      await this.cacheManager.set(cacheKey, count, 60); // Cache count for 60 seconds
    }

    return count;
  }
}
