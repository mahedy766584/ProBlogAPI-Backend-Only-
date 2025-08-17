import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { BookMarkValidation } from "./bookmark.validation";
import { BookMarkController } from "./bookmark.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.post(
    '/create-bookmark',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.author,
        USER_ROLE.user
    ),
    validateRequest(
        BookMarkValidation.createBookMarkSchemaValidation
    ),
    BookMarkController.createBookMarkIntoDB,
);

router.get(
    '/',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
    ),
    BookMarkController.getAllBookmarkFromDB,
);

router.get(
    '/:id/bookmark',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.author,
        USER_ROLE.user
    ),
    BookMarkController.getForUserBookmark,
);

router.delete(
    '/:id',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.author,
        USER_ROLE.user,
    ),
    BookMarkController.deleteBookmarkFromDB,
);

export const BookmarkRoutes = router;