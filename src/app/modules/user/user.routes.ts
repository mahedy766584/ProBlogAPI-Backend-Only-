import express, { NextFunction, Request, Response } from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";
import { upload } from "../../utils/sendImageToCloudinary";

const router = express.Router();

router.post(
    '/create-user',
    upload.single('file'),
    (req: Request, res: Response, next: NextFunction) =>{
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