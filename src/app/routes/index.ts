import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { CategoryRoutes } from "../modules/category/category.routes";
import { TagRoutes } from "../modules/tag/tag.route";
import { BlogPostRoutes } from "../modules/blogPost/blogPost.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { AuthorRequestRoutes } from "../modules/AuthorRequest/authorRequest.route";
import { CommentRoutes } from "../modules/comment/comment.route";

const router = Router();

const moduleRoutes = [
    {
        path: '/users',
        route: UserRoutes,
    },
    {
        path: '/categories',
        route: CategoryRoutes,
    },
    {
        path: '/tags',
        route: TagRoutes,
    },
    {
        path: '/blogs',
        route: BlogPostRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes,
    },
    {
        path: '/authors',
        route: AuthorRequestRoutes,
    },
    {
        path: '/comments',
        route: CommentRoutes,
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;