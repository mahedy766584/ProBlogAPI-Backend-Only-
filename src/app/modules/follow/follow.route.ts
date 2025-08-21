import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { FollowValidation } from "./follow.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { FollowController } from "./follow.controller";

const router = Router();

router.post(
    '/create-follow',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.author,
        USER_ROLE.user
    ),
    validateRequest(
        FollowValidation.followValidationSchema,
    ),
    FollowController.createFollowUser,
);

router.post(
    '/create-unfollow',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.author,
        USER_ROLE.user
    ),
    validateRequest(
        FollowValidation.unFollowValidationSchema,
    ),
    FollowController.createUnfollowUser,
);

router.get(
    '/followers',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.author,
        USER_ROLE.user
    ),
    FollowController.getFollowersFromDB
);

router.get(
    '/following',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.author,
        USER_ROLE.user
    ),
    FollowController.getFollowingFromDB
);

export const FollowRoutes = router;