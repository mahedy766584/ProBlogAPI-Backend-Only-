import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { upload } from "../../utils/file/sendImageToCloudinary";

const router = express.Router();

router.post(
    '/create-user',
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    },
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

router.patch(
    '/:id/restore',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
    ),
    UserController.restoreDeletedUserFromDB,
);

router.patch(
    '/:id/update-profile-image',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
        USER_ROLE.author,
        USER_ROLE.user
    ),
    upload.single('file'),
    UserController.updateUserProfileImage,
);

router.patch(
    '/:id/deactivate',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
    ),
    UserController.deactivateUserAccount,
);

router.patch(
    '/:id/activated',
    auth(
        USER_ROLE.superAdmin,
        USER_ROLE.admin,
    ),
    UserController.activateUserAccount,
);

router.patch(
    '/:id/update-role',
    auth(
        USER_ROLE.superAdmin,
    ),
    validateRequest(UserValidations.updateUserRoleSchemaValidation),
    UserController.updateUserRole,
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



export const UserRoutes = router;