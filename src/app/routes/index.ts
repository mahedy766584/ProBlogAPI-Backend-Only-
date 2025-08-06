import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { CategoryRoutes } from "../modules/category/category.routes";
import { TagRoutes } from "../modules/tag/tag.route";
import { BlogPostRoutes } from "../modules/blogPost/blogPost.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";

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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;