import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

//TODO use this to get all the users comments

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
