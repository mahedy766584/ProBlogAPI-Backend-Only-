import express from "express";
import { UserController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validation";

const router = express.Router();

router.post(
    '/create-user',
    validateRequest(
        UserValidations.createUserZodSchema
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

export const UserRoutes = router;