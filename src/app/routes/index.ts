import { Router } from "express";
import { UserRoutes } from "../modules/user/user.routes";
import { CategoryRoutes } from "../modules/category/category.routes";

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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;