import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

//@ Prisma is working on a new syntax proposal to be able to exclude certain fields when returning model instances
//@ Should look something like:
//* password String? @private
//@ until that's implemented I'm using Promise<any> and losing my type safety but hopefully we'll get that update soon

@Injectable()
export class UserService {
  logger = new Logger();
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async login(userData: {
    username: string;
    password: string;
  }): Promise<{ accessToken: string }> {
    const { username, password } = userData;
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('please check your login credentials');
    }
  }

  async createUser(data: Prisma.UserCreateInput): Promise<void> {
    const salt = await bcrypt.genSalt(); //* hash
    data.password = await bcrypt.hash(data.password, salt);
    try {
      await this.prisma.user.create({ data });
    } catch (err) {
      if (err.code === 'P2002') {
        this.logger.error(err.code);
        //* I think this is the right error code for PRISMA constraint field error
        //* duplicate username code error
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<any | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
      select: { password: false, username: true, email: true, id: true },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<any> {
    const { where, data } = params;
    if (data.password) {
      //* user is changing password. need to hash it
      const salt = await bcrypt.genSalt(); //* hash
      data.password = await bcrypt.hash(data.password, salt);
    }
    return this.prisma.user.update({
      data,
      where,
      select: { password: false, username: true, email: true, id: true },
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<void> {
    await this.prisma.user.delete({ where });
    return;
  }
}
