import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Comment, Prisma } from '@prisma/client';

@Injectable()
export class CommentService {
  private logger = new Logger('CommentService Logger');
  constructor(private prisma: PrismaService) {}

  async getAuthorId(
    commentWhereUniqueInput: Prisma.CommentWhereUniqueInput,
  ): Promise<string> {
    const comment = await this.prisma.comment.findUnique({
      where: commentWhereUniqueInput,
    });
    const { userId } = comment;
    return userId;
  }

  async createComment(data: Prisma.CommentCreateInput): Promise<Comment> {
    return this.prisma.comment.create({ data });
  }

  async updateComment(params: {
    where: Prisma.CommentWhereUniqueInput;
    data: Prisma.CommentUpdateInput;
  }): Promise<Comment> {
    const { where, data } = params;
    return this.prisma.comment.update({ where, data });
  }

  async deleteComment(where: Prisma.CommentWhereUniqueInput): Promise<void> {
    const { id } = where;
    const result = await this.prisma.comment.delete({ where: { id } });
    if (!result) {
      throw new NotFoundException(
        `Could not locate comment with the id: ${id}`,
      );
    }
    this.logger.log(`Succesfully deleted the comment with id: ${id}`);
    return null;
  }
}
