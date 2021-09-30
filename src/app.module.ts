import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { UserService } from './auth/user.service';
import { PostService } from './posts/post.service';
import { CommentService } from './comments/comment.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      //* async because environment vars must init from configModule
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: 360000 },
      }),
    }),
  ],
  providers: [
    PrismaService,
    JwtStrategy,
    UserService,
    PostService,
    CommentService,
  ],
  controllers: [AppController],
})
export class AppModule {}
