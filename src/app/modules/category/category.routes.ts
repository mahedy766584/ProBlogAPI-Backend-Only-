import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryValidations } from "./category.validation";
import { CategoryController } from "./category.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

router.post(
    '/create-category',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(
        CategoryValidations.createCategoryValidationSchema,
    ),
    CategoryController.createCategoryIntoDB,
);

router.get(
    '/',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    CategoryController.getAllCategoriesFromDB,
);

router.get(
    '/:id',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    CategoryController.getSingleCategoryFromDB,
);

export const CategoryRoutes = router;