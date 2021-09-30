import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Post, Prisma } from '@prisma/client';

@Injectable()
export class PostService {
  private logger = new Logger('PostService Logger');
  constructor(private prisma: PrismaService) {}

  async anyPost(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: postWhereUniqueInput });
  }

  async publishedPost(id: string): Promise<Post | void> {
    const foundArray = await this.prisma.post.findMany({
      where: {
        id,
        published: true,
      },
      include: {
        comments: {
          orderBy: { createdAt: 'asc' },
          select: {
            comment: true,
            id: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
    if (foundArray.length < 1) {
      throw new NotFoundException(`No post with ${id} could be found!`);
    }
    const found = foundArray[0];
    return found;
  }

  async posts(params: {
    skip?: number;
    cursor?: Prisma.PostWhereUniqueInput;
    where?: Prisma.PostWhereInput;
  }): Promise<Post[]> {
    const { skip, cursor, where } = params;

    // TODO: figure out pagination on the off chance I write hundreds of blog posts

    return this.prisma.post.findMany({
      skip,
      take: 20,
      cursor,
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPost(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({ data });
  }

  async editPost(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }): Promise<Post> {
    const { where, data } = params;
    return this.prisma.post.update({ where, data });
  }

  async publishPost(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }): Promise<Post> {
    const { where, data } = params;
    return this.prisma.post.update({
      where,
      data,
    });
  }

  async unpublishPost(params: {
    where: Prisma.PostWhereUniqueInput;
    data: Prisma.PostUpdateInput;
  }): Promise<void> {
    const { where, data } = params;
    const result = await this.prisma.post.update({
      where,
      data,
    });
    if (!result) {
      throw new NotFoundException(
        `Post with ID ${where.id} could not be found`,
      );
    }
    this.logger.log(`post with id ${where.id} sucessfully unpublished`);
  }

  async deletePost(where: Prisma.PostWhereUniqueInput): Promise<void> {
    const result = await this.prisma.post.delete({ where });
    if (!result) {
      throw new NotFoundException(
        `Post with ID ${where.id} could not be found`,
      );
    }
  }
}
