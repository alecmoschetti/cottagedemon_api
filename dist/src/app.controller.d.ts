import { Post as PostModel, User as UserModel, Comment as CommentModel } from '@prisma/client';
import { PostService } from './post.service';
import { UserService } from './user.service';
import { CommentService } from './comment.service';
import { Role } from './role.enum';
export declare class AppController {
    private readonly userService;
    private readonly postService;
    private readonly commentService;
    private logger;
    constructor(userService: UserService, postService: PostService, commentService: CommentService);
    signupUser(userData: {
        username: string;
        email: string;
        password: string;
        role?: Role;
    }): Promise<void>;
    loginUser(userData: {
        username: string;
        password: string;
    }): Promise<{
        accessToken: string;
    }>;
    deleteUser(user: UserModel): Promise<void>;
    displayUser(user: UserModel): Promise<UserModel>;
    updateUser(userData: {
        username?: string;
        email?: string;
        password?: string;
    }, user: UserModel): Promise<UserModel>;
    getAllPosts(): Promise<PostModel[]>;
    getPrivatePostById(id: string): Promise<PostModel>;
    createPost(postData: {
        title: string;
        body: string;
        published?: boolean;
    }, user: UserModel): Promise<PostModel>;
    publishPost(id: string): Promise<PostModel>;
    deletePost(id: string): Promise<void>;
    getPublishedPosts(): Promise<PostModel[]>;
    getFilteredPosts(query: any): Promise<PostModel[]>;
    getPublicPostById(id: string): Promise<PostModel>;
    createComment(postId: string, commentData: {
        comment: string;
    }, user: UserModel): Promise<CommentModel>;
}
