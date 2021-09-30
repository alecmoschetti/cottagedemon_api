import { PrismaService } from '../prisma.service';
import { Comment, Prisma } from '@prisma/client';
export declare class CommentService {
    private prisma;
    private logger;
    constructor(prisma: PrismaService);
    getAuthorId(commentWhereUniqueInput: Prisma.CommentWhereUniqueInput): Promise<string>;
    createComment(data: Prisma.CommentCreateInput): Promise<Comment>;
    updateComment(params: {
        where: Prisma.CommentWhereUniqueInput;
        data: Prisma.CommentUpdateInput;
    }): Promise<Comment>;
    deleteComment(where: Prisma.CommentWhereUniqueInput): Promise<void>;
}
