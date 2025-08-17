import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { LikeValidation } from "./like.validation";
import { LikeController } from "./like.controller";

const router = Router();

router.post(
    '/create-like',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.author,
        USER_ROLE.user,
    ),
    validateRequest(
        LikeValidation.createLikeValidationSchema,
    ),
    LikeController.createToggleLikeIntoDB,
);

router.get(
    '/:blogPostId/count',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.author,
        USER_ROLE.user,
    ),
    LikeController.getLikeCountFromDB
);

export const LikeRoutes = router;