import express from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

router.post(
    '/create-user',
    validateRequest(
        UserValidations.createUserValidationSchema
    ),
    UserController.createUserIntoDB,
);

router.get(
    '/',
    UserController.getAllUserFromDB,
);

router.get(
    '/:id',
    UserController.getSingleUserFromDB,
);

router.patch(
    '/:id',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.author,
        USER_ROLE.user
    ),
    validateRequest(
        UserValidations.updateUserValidationSchema
    ),
    UserController.updateSingleUserIntoDB,
);

router.delete(
    '/:id',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.author,
        USER_ROLE.user
    ),
    UserController.deleteUserFromDB,
);

router.get(
    '/:id/blog-post',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.author,
    ),
    UserController.getUserBlogPostFromDB,
);

export const UserRoutes = router;