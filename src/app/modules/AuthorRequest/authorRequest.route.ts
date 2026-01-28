import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { AuthorRequestValidation } from "./authorRequest.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { AuthorRequestController } from "./authorRequest.controller";

const router = Router();

router.post(
    '/crate-author-request',
    auth(USER_ROLE.user),
    validateRequest(
        AuthorRequestValidation.createAuthorRequestValidationSchema
    ),
    AuthorRequestController.createAuthorRequestIntoDB,
);

router.get(
    '/',
    auth(USER_ROLE.admin, USER_ROLE.user, USER_ROLE.superAdmin, USER_ROLE.author),
    AuthorRequestController.getAllAuthorRequestFromDB,
);

router.get(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.author, USER_ROLE.user),
    AuthorRequestController.getSingleAuthorRequestFromDB,
);

router.get(
    '/author/:userId',
    auth(USER_ROLE.admin, USER_ROLE.author, USER_ROLE.user),
    AuthorRequestController.getSingleAuthorByUserId,
);

router.patch(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.user),
    validateRequest(
        AuthorRequestValidation.updateAuthorRequestValidationSchema
    ),
    AuthorRequestController.updateSingleAuthorRequestIntoDB
);

router.delete(
    '/:id',
    auth(
        USER_ROLE.admin,
        USER_ROLE.author,
        USER_ROLE.superAdmin,
        USER_ROLE.user,
    ),
    AuthorRequestController.deletedAuthorRequestFromDB,
);

export const AuthorRequestRoutes = router;