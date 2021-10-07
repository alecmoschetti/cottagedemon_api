import {
  Post as PostModel,
  User as UserModel,
  Comment as CommentModel,
} from '@prisma/client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './posts/post.service';
import { UserService } from './auth/user.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './auth/get-user.decorator';
import { CommentService } from './comments/comment.service';
import { Roles } from './auth/roles.decorator';
import { Role } from './auth/role.enum';
import { RolesGuard } from './auth/roles.guard';

@Controller('api/v1')
export class AppController {
  private logger = new Logger('AppController');
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
    private readonly commentService: CommentService,
  ) {}

  @Post('user/signup')
  async signupUser(
    @Body()
    userData: {
      username: string;
      email: string;
      password: string;
    },
  ): Promise<void> {
    return this.userService.createUser(userData);
  }

  @Post('user/login')
  async loginUser(
    @Body() userData: { username: string; password: string },
  ): Promise<{ accessToken: string }> {
    this.logger.log(userData);
    this.logger.log(JSON.stringify(userData));
    this.logger.log(JSON.parse(JSON.stringify(userData)));
    return this.userService.login(userData);
  }

  @UseGuards(AuthGuard())
  @Delete('user/delete')
  async deleteUser(@GetUser() user: UserModel): Promise<void> {
    const { id } = user;
    return this.userService.deleteUser({ id });
  }

  @UseGuards(AuthGuard())
  @Get('user/profile')
  async displayUser(@GetUser() user: UserModel): Promise<UserModel> {
    const { id } = user;
    return this.userService.user({ id });
  }

  @UseGuards(AuthGuard())
  @Patch('user/update')
  async updateUser(
    @Body() userData: { username?: string; email?: string; password?: string },
    @GetUser() user: UserModel,
  ): Promise<UserModel> {
    const { id } = user;
    return this.userService.updateUser({ where: { id }, data: userData });
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Get('admin/posts')
  @Roles(Role.ADMIN)
  async getAllPosts(): Promise<PostModel[]> {
    return this.postService.posts({});
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Get('admin/posts/:id')
  @Roles(Role.ADMIN)
  async getPrivatePostById(@Param('id') id: string): Promise<PostModel> {
    return this.postService.anyPost({ id });
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Post('admin/posts')
  @Roles(Role.ADMIN)
  async createPost(
    @Body() postData: { title: string; body: string; published?: boolean },
    @GetUser() user: UserModel,
  ): Promise<PostModel> {
    const { title, body, published } = postData;
    const { id } = user;
    return this.postService.createPost({
      title,
      body,
      published,
      user: { connect: { id } },
    });
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Patch('admin/posts/:id')
  @Roles(Role.ADMIN)
  async editPost(
    @Param('id') id: string,
    @Body() postData: { title: string; body: string; published?: boolean },
  ): Promise<PostModel> {
    const { title, body, published } = postData;
    return this.postService.editPost({
      where: { id },
      data: { title, body, published },
    });
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Patch('admin/posts/:id/publish')
  @Roles(Role.ADMIN)
  async publishPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.publishPost({
      where: { id },
      data: { published: true },
    });
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Patch('admin/posts/:id/unpublish')
  @Roles(Role.ADMIN)
  async unpublishPost(@Param('id') id: string): Promise<void> {
    return this.postService.unpublishPost({
      where: { id },
      data: { published: false },
    });
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Delete('admin/posts/:id')
  @Roles(Role.ADMIN)
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.postService.deletePost({ id });
  }

  @Get('posts')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postService.posts({
      where: { published: true },
    });
  }

  @Get('posts/filter')
  async getFilteredPosts(@Query() query): Promise<PostModel[]> {
    return this.postService.posts({
      where: {
        OR: [
          {
            title: { contains: query.filter, mode: 'insensitive' },
          },
          {
            body: { contains: query.filter, mode: 'insensitive' },
          },
        ],
      },
    });
  }

  @Get('posts/:id')
  async getPublicPostById(@Param('id') id: string): Promise<PostModel | void> {
    return this.postService.publishedPost(id);
  }

  @UseGuards(AuthGuard())
  @Post('posts/:postId')
  async createComment(
    @Param('postId') postId: string,
    @Body() commentData: { comment: string },
    @GetUser() user: UserModel,
  ): Promise<CommentModel> {
    const { comment } = commentData;
    const { id } = user;
    return this.commentService.createComment({
      comment,
      post: { connect: { id: postId } },
      user: { connect: { id } },
    });
  }

  @UseGuards(AuthGuard())
  @Patch('posts/:postId/:commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() commentData: { comment: string },
  ): Promise<CommentModel> {
    const { comment } = commentData;
    return this.commentService.updateComment({
      where: { id: commentId },
      data: { comment },
    });
  }

  @UseGuards(AuthGuard())
  @Delete('posts/:postId/:commentId')
  async deleteComment(
    @Param('commentId') id: string,
    @GetUser() user: UserModel,
  ): Promise<void> {
    const commentAuthor = await this.commentService.getAuthorId({ id });
    if (commentAuthor === user.id) {
      return this.commentService.deleteComment({ id });
    } else {
      throw new UnauthorizedException('Cannot delete other users comments');
    }
  }
}
