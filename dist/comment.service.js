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
exports.CommentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
let CommentService = class CommentService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger('CommentService Logger');
    }
    async getAuthorId(commentWhereUniqueInput) {
        const comment = await this.prisma.comment.findUnique({
            where: commentWhereUniqueInput,
        });
        const { userId } = comment;
        return userId;
    }
    async createComment(data) {
        return this.prisma.comment.create({ data });
    }
    async updateComment(params) {
        const { where, data } = params;
        return this.prisma.comment.update({ where, data });
    }
    async deleteComment(where) {
        const { id } = where;
        const result = await this.prisma.comment.delete({ where: { id } });
        if (!result) {
            throw new common_1.NotFoundException(`Could not locate comment with the id: ${id}`);
        }
        this.logger.log(`Succesfully deleted the comment with id: ${id}`);
        return null;
    }
};
CommentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentService);
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map