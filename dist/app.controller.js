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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const post_service_1 = require("./posts/post.service");
const user_service_1 = require("./auth/user.service");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("./auth/get-user.decorator");
const comment_service_1 = require("./comments/comment.service");
const roles_decorator_1 = require("./auth/roles.decorator");
const role_enum_1 = require("./auth/role.enum");
const roles_guard_1 = require("./auth/roles.guard");
let AppController = class AppController {
    constructor(userService, postService, commentService) {
        this.userService = userService;
        this.postService = postService;
        this.commentService = commentService;
    }
    async signupUser(userData) {
        return this.userService.createUser(userData);
    }
    async loginUser(userData) {
        return this.userService.login(userData);
    }
    async deleteUser(user) {
        const { id } = user;
        return this.userService.deleteUser({ id });
    }
    async displayUser(user) {
        const { id } = user;
        return this.userService.user({ id });
    }
    async updateUser(userData, user) {
        const { id } = user;
        return this.userService.updateUser({ where: { id }, data: userData });
    }
    async getAllPosts() {
        return this.postService.posts({});
    }
    async getPrivatePostById(id) {
        return this.postService.anyPost({ id });
    }
    async createPost(postData, user) {
        const { title, body, published } = postData;
        const { id } = user;
        return this.postService.createPost({
            title,
            body,
            published,
            user: { connect: { id } },
        });
    }
    async publishPost(id) {
        return this.postService.publishPost({
            where: { id },
            data: { published: true },
        });
    }
    async deletePost(id) {
        return this.postService.deletePost({ id });
    }
    async getPublishedPosts() {
        return this.postService.posts({
            where: { published: true },
        });
    }
    async getFilteredPosts(query) {
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
    async getPublicPostById(id) {
        return this.postService.publishedPost(id);
    }
    async createComment(postId, commentData, user) {
        const { comment } = commentData;
        const { id } = user;
        return this.commentService.createComment({
            comment,
            post: { connect: { id: postId } },
            user: { connect: { id } },
        });
    }
    async updateComment(commentId, commentData) {
        const { comment } = commentData;
        return this.commentService.updateComment({
            where: { id: commentId },
            data: { comment },
        });
    }
    async deleteComment(id, user) {
        const commentAuthor = await this.commentService.getAuthorId({ id });
        if (commentAuthor === user.id) {
            return this.commentService.deleteComment({ id });
        }
        else {
            throw new common_1.UnauthorizedException('Cannot delete other users comments');
        }
    }
};
__decorate([
    (0, common_1.Post)('user/signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "signupUser", null);
__decorate([
    (0, common_1.Post)('user/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "loginUser", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, common_1.Delete)('user/delete'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, common_1.Get)('user/profile'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "displayUser", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, common_1.Patch)('user/update'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateUser", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, common_1.Get)('admin/posts'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getAllPosts", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, common_1.Get)('admin/posts/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPrivatePostById", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, common_1.Post)('admin/posts'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createPost", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, common_1.Patch)('admin/posts/:id/publish'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "publishPost", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)(), roles_guard_1.RolesGuard),
    (0, common_1.Delete)('admin/posts/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deletePost", null);
__decorate([
    (0, common_1.Get)('posts'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPublishedPosts", null);
__decorate([
    (0, common_1.Get)('posts/filter'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getFilteredPosts", null);
__decorate([
    (0, common_1.Get)('posts/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPublicPostById", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, common_1.Post)('posts/:postId'),
    __param(0, (0, common_1.Param)('postId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "createComment", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, common_1.Patch)('posts/:postId/:commentId'),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "updateComment", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, common_1.Delete)('posts/:postId/:commentId'),
    __param(0, (0, common_1.Param)('commentId')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteComment", null);
AppController = __decorate([
    (0, common_1.Controller)('api/v1'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        post_service_1.PostService,
        comment_service_1.CommentService])
], AppController);
exports.AppController = AppController;
//# sourceMappingURL=app.controller.js.map