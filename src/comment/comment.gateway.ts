import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@WebSocketGateway()
export class CommentGateway {
  @WebSocketServer()
  server: Server;

  constructor(private commentService: CommentService) {}

  @SubscribeMessage('createComment')
  async handleCreateComment(@MessageBody() createCommentDto: CreateCommentDto) {
    const comment = await this.commentService.create(createCommentDto);
    this.server.emit('commentCreated', comment);
    return comment;
  }
}
