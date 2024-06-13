import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentEventListener {
  @OnEvent('comment.created')
  handleCommentCreatedEvent(comment: Comment) {
    console.log('New comment created:', comment);
  }
}
