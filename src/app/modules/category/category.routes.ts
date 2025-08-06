import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryValidations } from "./category.validation";
import { CategoryController } from "./category.controller";

const router = Router();

router.post(
    '/create-category',
    validateRequest(
        CategoryValidations.createCategoryValidationSchema,
    ),
    CategoryController.createCategoryIntoDB,
);

router.get(
    '/',
    CategoryController.getAllCategoriesFromDB,
);

router.get(
    '/:id',
    CategoryController.getSingleCategoryFromDB,
);

export const CategoryRoutes = router;