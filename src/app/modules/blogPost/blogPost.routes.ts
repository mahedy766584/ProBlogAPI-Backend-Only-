import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { BlogPostValidation } from "./blogPost.validation";
import { BlogPostController } from "./blogPost.controller";

const router = Router();

router.post(
    '/create-blog-post',
    validateRequest(
        BlogPostValidation.createBlogPostZodSchema
    ),
    BlogPostController.createBlogPostIntoDB
);

export const BlogPostRoutes = router;