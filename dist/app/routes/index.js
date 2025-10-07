"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = require("../modules/user/user.routes");
const category_routes_1 = require("../modules/category/category.routes");
const tag_route_1 = require("../modules/tag/tag.route");
const blogPost_routes_1 = require("../modules/blogPost/blogPost.routes");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const authorRequest_route_1 = require("../modules/AuthorRequest/authorRequest.route");
const comment_route_1 = require("../modules/comment/comment.route");
const like_route_1 = require("../modules/Like/like.route");
const bookmark_route_1 = require("../modules/bookmark/bookmark.route");
const follow_route_1 = require("../modules/follow/follow.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/users',
        route: user_routes_1.UserRoutes,
    },
    {
        path: '/categories',
        route: category_routes_1.CategoryRoutes,
    },
    {
        path: '/tags',
        route: tag_route_1.TagRoutes,
    },
    {
        path: '/blogs',
        route: blogPost_routes_1.BlogPostRoutes,
    },
    {
        path: '/auth',
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: '/authors',
        route: authorRequest_route_1.AuthorRequestRoutes,
    },
    {
        path: '/comments',
        route: comment_route_1.CommentRoutes,
    },
    {
        path: '/likes',
        route: like_route_1.LikeRoutes,
    },
    {
        path: '/bookmarks',
        route: bookmark_route_1.BookmarkRoutes,
    },
    {
        path: '/follows',
        route: follow_route_1.FollowRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
