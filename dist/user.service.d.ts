import { Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
export declare class UserService {
    private prisma;
    private jwtService;
    logger: Logger;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(userData: {
        username: string;
        password: string;
    }): Promise<{
        accessToken: string;
    }>;
    createUser(data: Prisma.UserCreateInput): Promise<void>;
    user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<any | null>;
    updateUser(params: {
        where: Prisma.UserWhereUniqueInput;
        data: Prisma.UserUpdateInput;
    }): Promise<any>;
    deleteUser(where: Prisma.UserWhereUniqueInput): Promise<void>;
}
