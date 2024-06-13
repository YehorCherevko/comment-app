import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentGateway } from './comment.gateway';
import { CaptchaModule } from '../captcha/captcha.module';
import { CacheModule } from '@nestjs/cache-manager';
import { CommentEventListener } from './comment-event.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    CaptchaModule,
    CacheModule.register(),
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentGateway, CommentEventListener],
})
export class CommentModule {}
