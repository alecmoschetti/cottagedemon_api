"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let PostService = class PostService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger('PostService Logger');
    }
    async anyPost(postWhereUniqueInput) {
        return this.prisma.post.findUnique({ where: postWhereUniqueInput });
    }
    async publishedPost(id) {
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
            throw new common_1.NotFoundException(`No post with ${id} could be found!`);
        }
        const found = foundArray[0];
        return found;
    }
    async posts(params) {
        const { skip, cursor, where } = params;
        return this.prisma.post.findMany({
            skip,
            take: 20,
            cursor,
            where,
            orderBy: { createdAt: 'desc' },
        });
    }
    async createPost(data) {
        return this.prisma.post.create({ data });
    }
    async publishPost(params) {
        const { where, data } = params;
        return this.prisma.post.update({
            where,
            data,
        });
    }
    async deletePost(where) {
        const result = await this.prisma.post.delete({ where });
        if (!result) {
            throw new common_1.NotFoundException(`Post with ID ${where.id} does not exist`);
        }
    }
};
PostService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PostService);
exports.PostService = PostService;
//# sourceMappingURL=post.service.js.map