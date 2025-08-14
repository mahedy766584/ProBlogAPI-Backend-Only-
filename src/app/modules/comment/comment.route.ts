import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CommentValidations } from "./comment.validation";
import { CommentController } from "./comment.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.post(
    '/create-comment',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.author,
        USER_ROLE.user,
    ),
    validateRequest(
        CommentValidations.createCommentValidationSchema,
    ),
    CommentController.createCommentInPostIntoDB
);

router.get(
    '/',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.author,
        USER_ROLE.user,
    ),
    CommentController.getAllCommentsFromDB,
);

router.get(
    '/:id',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.author,
        USER_ROLE.user,
    ),
    CommentController.getSingleCommentFromDB,
);

export const CommentRoutes = router;