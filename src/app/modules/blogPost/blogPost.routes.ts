import { NextFunction, Request, Response, Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { BlogPostValidation } from "./blogPost.validation";
import { BlogPostController } from "./blogPost.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { upload } from "../../utils/file/sendImageToCloudinary";

const router = Router();

router.post(
    '/create-blog-post',
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
    auth(
        USER_ROLE.author,
        USER_ROLE.admin,
        USER_ROLE.superAdmin,
    ),
    validateRequest(
        BlogPostValidation.createBlogPostZodSchema
    ),
    BlogPostController.createBlogPostIntoDB
);

router.get(
    '/',
    auth(
        USER_ROLE.admin,
        USER_ROLE.superAdmin,
        USER_ROLE.author,
        USER_ROLE.user,
    ),
    BlogPostController.getAllBlogPostFromDB,
);

router.get(
    '/:id',
    auth(
        USER_ROLE.admin,
        USER_ROLE.superAdmin,
        USER_ROLE.author,
    ),
    BlogPostController.getSingleBlogPostFromDB,
);

router.patch(
    '/:id',
    auth(
        USER_ROLE.admin,
        USER_ROLE.superAdmin,
        USER_ROLE.author,
    ),
    BlogPostController.updateSingleBlogPostIntoDB
);

router.delete(
    '/:id',
    auth(
        USER_ROLE.admin,
        USER_ROLE.superAdmin,
        USER_ROLE.author,
    ),
    BlogPostController.deleteSingleBlogPostFromDB
);

export const BlogPostRoutes = router;