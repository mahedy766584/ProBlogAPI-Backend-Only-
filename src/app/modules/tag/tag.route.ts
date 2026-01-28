import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { TagValidations } from "./tag.validation";
import { TagController } from "./tag.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.post(
    '/crate-tag',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        TagValidations.createTagValidationSchema,
    ),
    TagController.creteTagIntoDB
);

router.get(
    '/',
    // auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    TagController.getAllTagFromDB,
);

router.get(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    TagController.getSingleTagFromDB,
);

export const TagRoutes = router;