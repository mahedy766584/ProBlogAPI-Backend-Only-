import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { TagValidations } from "./tag.validation";
import { TagController } from "./tag.controller";

const router = Router();

router.post(
    '/crate-tag',
    validateRequest(
        TagValidations.createTagValidationSchema,
    ),
    TagController.creteTagIntoDB
);

router.get(
    '/',
    TagController.getAllTagFromDB,
);

router.get(
    '/:id',
    TagController.getSingleTagFromDB,
);

export const TagRoutes = router;