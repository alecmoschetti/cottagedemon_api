import { PrismaService } from '../prisma.service';
import { Post, Prisma } from '@prisma/client';
export declare class PostService {
    private prisma;
    private logger;
    constructor(prisma: PrismaService);
    anyPost(postWhereUniqueInput: Prisma.PostWhereUniqueInput): Promise<Post | null>;
    publishedPost(id: string): Promise<Post | void>;
    posts(params: {
        skip?: number;
        cursor?: Prisma.PostWhereUniqueInput;
        where?: Prisma.PostWhereInput;
    }): Promise<Post[]>;
    createPost(data: Prisma.PostCreateInput): Promise<Post>;
    publishPost(params: {
        where: Prisma.PostWhereUniqueInput;
        data: Prisma.PostUpdateInput;
    }): Promise<Post>;
    unpublishPost(params: {
        where: Prisma.PostWhereUniqueInput;
        data: Prisma.PostUpdateInput;
    }): Promise<void>;
    deletePost(where: Prisma.PostWhereUniqueInput): Promise<void>;
}
